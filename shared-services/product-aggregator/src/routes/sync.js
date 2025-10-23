const express = require('express');
const router = express.Router();
const db = require('../config/database');
const redis = require('../config/redis');

// Sync products from tenant
router.post('/products', async (req, res) => {
  try {
    const { tenant_id, products } = req.body;
    
    if (!tenant_id || !products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message: 'tenant_id and products array are required'
      });
    }
    
    // Get tenant info
    const tenantQuery = 'SELECT * FROM tenants WHERE id = ?';
    const [tenant] = await db.executeQuery(tenantQuery, [tenant_id]);
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found',
        message: 'The specified tenant does not exist'
      });
    }
    
    // Sync products
    const syncResults = [];
    
    for (const product of products) {
      try {
        // Check if product already exists
        const existingQuery = 'SELECT id FROM global_products WHERE tenant_id = ? AND original_id = ?';
        const existing = await db.executeQuery(existingQuery, [tenant_id, product.id]);
        
        if (existing.length > 0) {
          // Update existing product
          const updateQuery = `
            UPDATE global_products 
            SET name = ?, description = ?, price = ?, category = ?, brand = ?, 
                image_url = ?, stock_quantity = ?, rating = ?, updated_at = NOW()
            WHERE tenant_id = ? AND original_id = ?
          `;
          
          await db.executeQuery(updateQuery, [
            product.name,
            product.description,
            product.price,
            product.category,
            product.brand,
            product.image_url,
            product.stock_quantity,
            product.rating,
            tenant_id,
            product.id
          ]);
          
          syncResults.push({
            id: product.id,
            action: 'updated',
            status: 'success'
          });
        } else {
          // Insert new product
          const insertQuery = `
            INSERT INTO global_products 
            (tenant_id, original_id, name, description, price, category, brand, 
             image_url, stock_quantity, rating, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `;
          
          await db.executeQuery(insertQuery, [
            tenant_id,
            product.id,
            product.name,
            product.description,
            product.price,
            product.category,
            product.brand,
            product.image_url,
            product.stock_quantity,
            product.rating
          ]);
          
          syncResults.push({
            id: product.id,
            action: 'created',
            status: 'success'
          });
        }
      } catch (error) {
        console.error(`Error syncing product ${product.id}:`, error);
        syncResults.push({
          id: product.id,
          action: 'failed',
          status: 'error',
          error: error.message
        });
      }
    }
    
    // Clear cache
    await redis.delMultiple(['products', 'products_stats', 'categories', 'brands']);
    
    res.json({
      success: true,
      data: {
        tenant_id,
        tenant_name: tenant.name,
        synced_products: syncResults.length,
        results: syncResults
      }
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Sync failed',
      message: error.message
    });
  }
});

// Sync brands from tenant
router.post('/brands', async (req, res) => {
  try {
    const { tenant_id, brands } = req.body;
    
    if (!tenant_id || !brands || !Array.isArray(brands)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message: 'tenant_id and brands array are required'
      });
    }
    
    // Get tenant info
    const tenantQuery = 'SELECT * FROM tenants WHERE id = ?';
    const [tenant] = await db.executeQuery(tenantQuery, [tenant_id]);
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found',
        message: 'The specified tenant does not exist'
      });
    }
    
    // Sync brands
    const syncResults = [];
    
    for (const brand of brands) {
      try {
        // Check if brand already exists
        const existingQuery = 'SELECT id FROM global_brands WHERE tenant_id = ? AND original_id = ?';
        const existing = await db.executeQuery(existingQuery, [tenant_id, brand.id]);
        
        if (existing.length > 0) {
          // Update existing brand
          const updateQuery = `
            UPDATE global_brands 
            SET name = ?, description = ?, logo_url = ?, website = ?, updated_at = NOW()
            WHERE tenant_id = ? AND original_id = ?
          `;
          
          await db.executeQuery(updateQuery, [
            brand.name,
            brand.description,
            brand.logo_url,
            brand.website,
            tenant_id,
            brand.id
          ]);
          
          syncResults.push({
            id: brand.id,
            action: 'updated',
            status: 'success'
          });
        } else {
          // Insert new brand
          const insertQuery = `
            INSERT INTO global_brands 
            (tenant_id, original_id, name, description, logo_url, website, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
          `;
          
          await db.executeQuery(insertQuery, [
            tenant_id,
            brand.id,
            brand.name,
            brand.description,
            brand.logo_url,
            brand.website
          ]);
          
          syncResults.push({
            id: brand.id,
            action: 'created',
            status: 'success'
          });
        }
      } catch (error) {
        console.error(`Error syncing brand ${brand.id}:`, error);
        syncResults.push({
          id: brand.id,
          action: 'failed',
          status: 'error',
          error: error.message
        });
      }
    }
    
    // Clear cache
    await redis.delMultiple(['brands', 'products_stats']);
    
    res.json({
      success: true,
      data: {
        tenant_id,
        tenant_name: tenant.name,
        synced_brands: syncResults.length,
        results: syncResults
      }
    });
  } catch (error) {
    console.error('Brand sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Brand sync failed',
      message: error.message
    });
  }
});

// Get sync status
router.get('/status', async (req, res) => {
  try {
    const { tenant_id } = req.query;
    
    if (!tenant_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing tenant_id',
        message: 'tenant_id is required'
      });
    }
    
    // Get tenant info
    const tenantQuery = 'SELECT * FROM tenants WHERE id = ?';
    const [tenant] = await db.executeQuery(tenantQuery, [tenant_id]);
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found',
        message: 'The specified tenant does not exist'
      });
    }
    
    // Get sync statistics
    const productCountQuery = 'SELECT COUNT(*) as count FROM global_products WHERE tenant_id = ?';
    const [{ count: productCount }] = await db.executeQuery(productCountQuery, [tenant_id]);
    
    const brandCountQuery = 'SELECT COUNT(*) as count FROM global_brands WHERE tenant_id = ?';
    const [{ count: brandCount }] = await db.executeQuery(brandCountQuery, [tenant_id]);
    
    const lastSyncQuery = `
      SELECT MAX(updated_at) as last_sync 
      FROM (
        SELECT updated_at FROM global_products WHERE tenant_id = ?
        UNION ALL
        SELECT updated_at FROM global_brands WHERE tenant_id = ?
      ) as sync_times
    `;
    const [{ last_sync }] = await db.executeQuery(lastSyncQuery, [tenant_id, tenant_id]);
    
    res.json({
      success: true,
      data: {
        tenant_id,
        tenant_name: tenant.name,
        tenant_subdomain: tenant.subdomain,
        sync_status: {
          products_count: parseInt(productCount),
          brands_count: parseInt(brandCount),
          last_sync: last_sync,
          is_active: tenant.status === 'active'
        }
      }
    });
  } catch (error) {
    console.error('Sync status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sync status',
      message: error.message
    });
  }
});

// Force sync all tenants
router.post('/all', async (req, res) => {
  try {
    // Get all active tenants
    const tenantsQuery = 'SELECT * FROM tenants WHERE status = "active"';
    const tenants = await db.executeQuery(tenantsQuery);
    
    const syncResults = [];
    
    for (const tenant of tenants) {
      try {
        // This would typically call the tenant's API to get products and brands
        // For now, we'll just mark it as attempted
        syncResults.push({
          tenant_id: tenant.id,
          tenant_name: tenant.name,
          status: 'attempted',
          message: 'Sync endpoint called (implementation needed)'
        });
      } catch (error) {
        console.error(`Error syncing tenant ${tenant.id}:`, error);
        syncResults.push({
          tenant_id: tenant.id,
          tenant_name: tenant.name,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        total_tenants: tenants.length,
        sync_results: syncResults
      }
    });
  } catch (error) {
    console.error('All sync error:', error);
    res.status(500).json({
      success: false,
      error: 'All sync failed',
      message: error.message
    });
  }
});

module.exports = router;
