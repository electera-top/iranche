const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { executeQuery, createTenantDatabase, databaseExists } = require('../config/database');
const { cache } = require('../config/redis');
const { generateWordPressConfig } = require('../services/wordpress');
const { setupNginxConfig } = require('../services/nginx');
const { installWordPressForTenant } = require('../services/wordpress');

const router = express.Router();

// Validation schemas
const createTenantSchema = Joi.object({
  subdomain: Joi.string()
    .min(3)
    .max(63)
    .pattern(/^[a-z0-9-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Subdomain can only contain lowercase letters, numbers, and hyphens',
      'string.min': 'Subdomain must be at least 3 characters long',
      'string.max': 'Subdomain must be less than 63 characters'
    }),
  shop_name: Joi.string().min(2).max(255).required(),
  shop_description: Joi.string().max(1000).optional(),
  owner_name: Joi.string().min(2).max(255).required(),
  owner_email: Joi.string().email().required(),
  owner_phone: Joi.string().max(20).optional(),
  admin_password: Joi.string().min(6).max(50).required(),
  plan_type: Joi.string().valid('free', 'basic', 'premium', 'enterprise').default('free'),
  theme: Joi.string().max(100).default('default'),
  plugins: Joi.array().items(Joi.string()).default([])
});

const updateTenantSchema = Joi.object({
  shop_name: Joi.string().min(2).max(255).optional(),
  shop_description: Joi.string().max(1000).optional(),
  owner_name: Joi.string().min(2).max(255).optional(),
  owner_email: Joi.string().email().optional(),
  owner_phone: Joi.string().max(20).optional(),
  plan_type: Joi.string().valid('free', 'basic', 'premium', 'enterprise').optional(),
  theme: Joi.string().max(100).optional(),
  plugins: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('active', 'inactive', 'suspended').optional()
});


// Create new tenant (shop)
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error, value } = createTenantSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const {
      subdomain,
      shop_name,
      shop_description,
      owner_name,
      owner_email,
      owner_phone,
      admin_password,
      plan_type,
      theme,
      plugins
    } = value;

    // Set default values for optional fields
    const finalShopDescription = shop_description || null;
    const finalOwnerPhone = owner_phone || null;
    const finalPlanType = plan_type || 'free';
    const finalTheme = theme || 'default';
    const finalPlugins = plugins || [];

    // Check if subdomain already exists
    const existingTenant = await executeQuery(
      'SELECT id FROM tenants WHERE subdomain = ?',
      [subdomain]
    );

    if (existingTenant.length > 0) {
      return res.status(409).json({
        error: 'Subdomain already exists',
        message: 'This subdomain is already taken. Please choose another one.'
      });
    }

    // Check if email already exists
    const existingEmail = await executeQuery(
      'SELECT id FROM tenants WHERE owner_email = ?',
      [owner_email]
    );

    if (existingEmail.length > 0) {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'This email is already registered. Please use a different email.'
      });
    }

    // Generate unique database name and credentials
    const databaseName = `shop_${subdomain.replace(/-/g, '_')}_${Date.now()}`;
    const databaseUser = `user_${subdomain.replace(/-/g, '_')}_${uuidv4().replace(/-/g, '').substring(0, 8)}`;
    const databasePassword = uuidv4().replace(/-/g, '').substring(0, 16);
    
    // Use provided admin password
    const adminUsername = 'admin';
    const hashedAdminPassword = await bcrypt.hash(admin_password, 12);

    // Create tenant database
    await createTenantDatabase(databaseName, databaseUser, databasePassword);

    // Insert tenant record
    const insertResult = await executeQuery(
      `INSERT INTO tenants (
        subdomain, shop_name, shop_description, owner_name, owner_email, owner_phone,
        database_name, database_user, database_password, plan_type, theme, plugins,
        admin_username, admin_password, admin_email, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        subdomain, shop_name, finalShopDescription, owner_name, owner_email, finalOwnerPhone,
        databaseName, databaseUser, databasePassword, finalPlanType, finalTheme, JSON.stringify(finalPlugins),
        adminUsername, hashedAdminPassword, owner_email, 'pending'
      ]
    );

    const tenantId = insertResult.insertId;

    // Generate WordPress configuration
    const wpConfig = generateWordPressConfig({
      databaseName,
      databaseUser,
      databasePassword,
      subdomain,
      adminUsername,
      adminPassword: admin_password
    });

    // Setup Nginx configuration
    // await setupNginxConfig(subdomain, tenantId);
    console.log(`Nginx configuration setup skipped for tenant: ${subdomain}`);

    // Install WordPress for the tenant
    await installWordPressForTenant({
      subdomain,
      databaseName,
      databaseUser,
      databasePassword,
      adminUsername,
      adminPassword: admin_password,
      owner_email,
      shop_name,
      plan_type: finalPlanType
    });
    console.log(`WordPress installation completed for tenant: ${subdomain}`);

    // Clear cache (with error handling)
    try {
      await cache.del(`tenant:${subdomain}`);
      await cache.del('tenants:list');
    } catch (cacheError) {
      console.log('Cache clear failed (non-critical):', cacheError.message);
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: {
        tenant_id: tenantId,
        subdomain,
        shop_name,
        admin_url: `https://${subdomain}.${process.env.MAIN_DOMAIN}/admin`,
        admin_username: adminUsername,
        admin_password: admin_password, // Return the provided password
        database_name: databaseName,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create shop. Please try again.'
    });
  }
});
// Get all tenants (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;

    let whereClause = '';
    let params = [];

    if (status) {
      whereClause += ' WHERE status = ?';
      params.push(status);
    }

    if (search) {
      const searchClause = ' WHERE (subdomain LIKE ? OR shop_name LIKE ? OR owner_name LIKE ? OR owner_email LIKE ?)';
      const searchParam = `%${search}%`;
      
      if (whereClause) {
        whereClause += ' AND (subdomain LIKE ? OR shop_name LIKE ? OR owner_name LIKE ? OR owner_email LIKE ?)';
      } else {
        whereClause = searchClause;
      }
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM tenants${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get tenants
    const tenants = await executeQuery(
      `SELECT 
        id, subdomain, shop_name, shop_description, owner_name, owner_email, owner_phone,
        status, plan_type, created_at, updated_at,
        theme, plugins
      FROM tenants${whereClause}
      ORDER BY created_at DESC
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
      params
    );

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    res.json({
      success: true,
      data: {
        tenants,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        }
      }
    });

  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch shops'
    });
  }
});

// Get tenant by ID
router.get('/:id', async (req, res) => {
  try {
    const tenantId = parseInt(req.params.id);
    
    if (isNaN(tenantId)) {
      return res.status(400).json({
        error: 'Invalid tenant ID',
        message: 'Tenant ID must be a number'
      });
    }

    const tenants = await executeQuery(
      `SELECT 
        id, subdomain, shop_name, shop_description, owner_name, owner_email, owner_phone,
        status, plan_type, created_at, updated_at,
        theme, plugins
      FROM tenants WHERE id = ?`,
      [tenantId]
    );

    if (tenants.length === 0) {
      return res.status(404).json({
        error: 'Tenant not found',
        message: 'Shop not found'
      });
    }

    const tenant = tenants[0];
    
    // Parse JSON fields
    if (tenant.plugins) {
      tenant.plugins = JSON.parse(tenant.plugins);
    }

    res.json({
      success: true,
      data: tenant
    });

  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch shop details'
    });
  }
});

// Get tenant by subdomain
router.get('/subdomain/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;

    // Check cache first
    const cachedTenant = await cache.get(`tenant:${subdomain}`);
    if (cachedTenant) {
      return res.json({
        success: true,
        data: cachedTenant,
        cached: true
      });
    }

    const tenants = await executeQuery(
      `SELECT 
        id, subdomain, shop_name, shop_description, owner_name, owner_email, owner_phone,
        status, plan_type, created_at, updated_at,
        theme, plugins
      FROM tenants WHERE subdomain = ?`,
      [subdomain]
    );

    if (tenants.length === 0) {
      return res.status(404).json({
        error: 'Tenant not found',
        message: 'Shop not found'
      });
    }

    const tenant = tenants[0];
    
    // Parse JSON fields
    if (tenant.plugins) {
      tenant.plugins = JSON.parse(tenant.plugins);
    }

    // Cache the result
    await cache.set(`tenant:${subdomain}`, tenant, 3600);

    res.json({
      success: true,
      data: tenant
    });

  } catch (error) {
    console.error('Error fetching tenant by subdomain:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch shop details'
    });
  }
});

// Update tenant
router.put('/:id', async (req, res) => {
  try {
    const tenantId = parseInt(req.params.id);
    
    if (isNaN(tenantId)) {
      return res.status(400).json({
        error: 'Invalid tenant ID',
        message: 'Tenant ID must be a number'
      });
    }

    // Validate input
    const { error, value } = updateTenantSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    // Check if tenant exists
    const existingTenant = await executeQuery(
      'SELECT id, subdomain FROM tenants WHERE id = ?',
      [tenantId]
    );

    if (existingTenant.length === 0) {
      return res.status(404).json({
        error: 'Tenant not found',
        message: 'Shop not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateParams = [];

    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateParams.push(key === 'plugins' ? JSON.stringify(value[key]) : value[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        message: 'Please provide at least one field to update'
      });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateParams.push(tenantId);

    // Update tenant
    await executeQuery(
      `UPDATE tenants SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    // Clear cache
    await cache.del(`tenant:${existingTenant[0].subdomain}`);
    await cache.del('tenants:list');

    res.json({
      success: true,
      message: 'Shop updated successfully'
    });

  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update shop'
    });
  }
});

// Delete tenant
router.delete('/:id', async (req, res) => {
  try {
    const tenantId = parseInt(req.params.id);
    
    if (isNaN(tenantId)) {
      return res.status(400).json({
        error: 'Invalid tenant ID',
        message: 'Tenant ID must be a number'
      });
    }

    // Get tenant details
    const tenants = await executeQuery(
      'SELECT id, subdomain, database_name, database_user FROM tenants WHERE id = ?',
      [tenantId]
    );

    if (tenants.length === 0) {
      return res.status(404).json({
        error: 'Tenant not found',
        message: 'Shop not found'
      });
    }

    const tenant = tenants[0];

    // Delete tenant database
    await executeQuery(
      'CALL drop_tenant_database(?, ?)',
      [tenant.database_name, tenant.database_user]
    );

    // Delete tenant record
    await executeQuery('DELETE FROM tenants WHERE id = ?', [tenantId]);

    // Clear cache
    await cache.del(`tenant:${tenant.subdomain}`);
    await cache.del('tenants:list');

    res.json({
      success: true,
      message: 'Shop deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete shop'
    });
  }
});

// Check subdomain availability
router.get('/check-subdomain/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;

    // Validate subdomain format with comprehensive rules
    if (!subdomain || subdomain.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid subdomain format',
        message: 'Subdomain cannot be empty'
      });
    }

    if (subdomain.length < 3) {
      return res.status(400).json({
        error: 'Invalid subdomain format',
        message: 'Subdomain must be at least 3 characters long'
      });
    }

    if (subdomain.length > 63) {
      return res.status(400).json({
        error: 'Invalid subdomain format',
        message: 'Subdomain cannot be more than 63 characters long'
      });
    }

    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      return res.status(400).json({
        error: 'Invalid subdomain format',
        message: 'Subdomain can only contain lowercase letters, numbers, and hyphens'
      });
    }

    if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
      return res.status(400).json({
        error: 'Invalid subdomain format',
        message: 'Subdomain cannot start or end with a hyphen'
      });
    }

    if (subdomain.includes('--')) {
      return res.status(400).json({
        error: 'Invalid subdomain format',
        message: 'Subdomain cannot contain consecutive hyphens'
      });
    }

    // Check if subdomain exists
    const existingTenant = await executeQuery(
      'SELECT id FROM tenants WHERE subdomain = ?',
      [subdomain]
    );

    const isAvailable = existingTenant.length === 0;

    res.json({
      success: true,
      data: {
        subdomain,
        isAvailable,
        message: isAvailable ? 'Subdomain is available' : 'Subdomain is already taken'
      }
    });

  } catch (error) {
    console.error('Error checking subdomain:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check subdomain availability'
    });
  }
});

module.exports = router;
