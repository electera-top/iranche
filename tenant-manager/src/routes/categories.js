const express = require('express');
const Joi = require('joi');
const { executeQuery } = require('../config/database');
const { cache } = require('../config/redis');

const router = express.Router();

// Validation schemas
const createFloorSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  short_description: Joi.string().max(500).optional(),
  long_description: Joi.string().optional(),
  icon: Joi.string().max(100).default('fas fa-store'),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#3B82F6'),
  banner_url: Joi.string().uri().max(500).optional(),
  status: Joi.string().valid('active', 'inactive').default('active'),
  start_number: Joi.number().integer().min(0).required(),
  end_number: Joi.number().integer().min(0).required()
});

const updateFloorSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  short_description: Joi.string().max(500).optional(),
  long_description: Joi.string().optional(),
  icon: Joi.string().max(100).optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
  banner_url: Joi.string().uri().max(500).optional(),
  status: Joi.string().valid('active', 'inactive').optional()
});

const createCategorySchema = Joi.object({
  floor_id: Joi.number().integer().positive().required(),
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().optional(),
  icon: Joi.string().max(100).default('fas fa-tag'),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#3B82F6'),
  banner_url: Joi.string().uri().max(500).optional(),
  status: Joi.string().valid('active', 'inactive').default('active')
});

const updateCategorySchema = Joi.object({
  floor_id: Joi.number().integer().positive().optional(),
  name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().optional(),
  icon: Joi.string().max(100).optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
  banner_url: Joi.string().uri().max(500).optional(),
  status: Joi.string().valid('active', 'inactive').optional()
});

// Get all floors (parent categories)
router.get('/floors', async (req, res) => {
  try {
    const floors = await executeQuery(`
      SELECT 
        f.id, f.name, f.short_description, f.long_description, f.icon, f.color, f.banner_url, f.status,
        f.start_number, f.end_number, f.created_at, f.updated_at,
        CONCAT(f.start_number, '-', f.end_number) as number_range,
        COUNT(DISTINCT t.id) as store_count
      FROM tenant_categories f
      LEFT JOIN tenant_categories c ON c.parent_id = f.id
      LEFT JOIN tenants t ON t.category_id = c.id
      WHERE f.parent_id IS NULL
      GROUP BY f.id
      ORDER BY f.start_number ASC
    `);

    res.json({
      success: true,
      data: floors
    });
  } catch (error) {
    console.error('Error fetching floors:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch floors'
    });
  }
});

// Get all categories (children of floors)
router.get('/categories', async (req, res) => {
  try {
    const categories = await executeQuery(`
      SELECT 
        c.id, c.parent_id as floor_id, c.name, c.description, c.icon, c.color, c.banner_url, c.status,
        c.created_at, c.updated_at,
        f.name as floor_name,
        COUNT(DISTINCT t.id) as store_count
      FROM tenant_categories c
      LEFT JOIN tenant_categories f ON c.parent_id = f.id
      LEFT JOIN tenants t ON c.id = t.category_id
      WHERE c.parent_id IS NOT NULL
      GROUP BY c.id
      ORDER BY f.start_number ASC, c.name ASC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch categories'
    });
  }
});

// Create new floor
router.post('/floors', async (req, res) => {
  try {
    const { error, value } = createFloorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const { name, short_description, long_description, icon, color, banner_url, status, start_number, end_number } = value;

    if (start_number >= end_number) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'start_number must be less than end_number'
      });
    }

    const result = await executeQuery(`
      INSERT INTO tenant_categories 
      (parent_id, name, short_description, long_description, icon, color, banner_url, status, start_number, end_number)
      VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, short_description, long_description, icon, color, banner_url || null, status, start_number, end_number]);

    // Clear cache
    try {
      await cache.del('floors:list');
    } catch (cacheError) {
      console.log('Cache clear failed (non-critical):', cacheError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Floor created successfully',
      data: {
        id: result.insertId,
        name,
        start_number,
        end_number,
        number_range: `${start_number}-${end_number}`
      }
    });
  } catch (error) {
    console.error('Error creating floor:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create floor'
    });
  }
});

// Create new category
router.post('/categories', async (req, res) => {
  try {
    const { error, value } = createCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const { floor_id, name, description, icon, color, banner_url, status } = value;

    // Check if floor exists (must be a parent category)
    const floor = await executeQuery('SELECT id FROM tenant_categories WHERE id = ? AND parent_id IS NULL', [floor_id]);
    if (floor.length === 0) {
      return res.status(404).json({
        error: 'Floor not found',
        message: 'The specified floor does not exist'
      });
    }

    const result = await executeQuery(`
      INSERT INTO tenant_categories 
      (parent_id, name, description, icon, color, banner_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [floor_id, name, description, icon, color, banner_url, status]);

    // Clear cache
    try {
      await cache.del('categories:list');
    } catch (cacheError) {
      console.log('Cache clear failed (non-critical):', cacheError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        id: result.insertId,
        floor_id,
        name
      }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create category'
    });
  }
});

// Update floor (parent category)
router.put('/floors/:id', async (req, res) => {
  try {
    const floorId = parseInt(req.params.id);
    
    if (isNaN(floorId)) {
      return res.status(400).json({
        error: 'Invalid floor ID',
        message: 'Floor ID must be a number'
      });
    }

    const { error, value } = updateFloorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    // Check if floor exists
    const existingFloor = await executeQuery('SELECT id FROM tenant_categories WHERE id = ? AND parent_id IS NULL', [floorId]);
    if (existingFloor.length === 0) {
      return res.status(404).json({
        error: 'Floor not found',
        message: 'Floor not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateParams = [];

    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateParams.push(value[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        message: 'Please provide at least one field to update'
      });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateParams.push(floorId);

    await executeQuery(
      `UPDATE tenant_categories SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    // Clear cache
    try {
      await cache.del('floors:list');
    } catch (cacheError) {
      console.log('Cache clear failed (non-critical):', cacheError.message);
    }

    res.json({
      success: true,
      message: 'Floor updated successfully'
    });
  } catch (error) {
    console.error('Error updating floor:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update floor'
    });
  }
});

// Update category (child of a floor)
router.put('/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    
    if (isNaN(categoryId)) {
      return res.status(400).json({
        error: 'Invalid category ID',
        message: 'Category ID must be a number'
      });
    }

    const { error, value } = updateCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    // Check if category exists
    const existingCategory = await executeQuery('SELECT id FROM tenant_categories WHERE id = ? AND parent_id IS NOT NULL', [categoryId]);
    if (existingCategory.length === 0) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'Category not found'
      });
    }

    // If floor_id is being updated, check if new floor exists
    if (value.floor_id) {
      const floor = await executeQuery('SELECT id FROM tenant_categories WHERE id = ? AND parent_id IS NULL', [value.floor_id]);
      if (floor.length === 0) {
        return res.status(404).json({
          error: 'Floor not found',
          message: 'The specified floor does not exist'
        });
      }
    }

    // Build update query
    const updateFields = [];
    const updateParams = [];

    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateParams.push(value[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        message: 'Please provide at least one field to update'
      });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateParams.push(categoryId);

    await executeQuery(
      `UPDATE tenant_categories SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    // Clear cache
    try {
      await cache.del('categories:list');
    } catch (cacheError) {
      console.log('Cache clear failed (non-critical):', cacheError.message);
    }

    res.json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update category'
    });
  }
});

// Delete floor (parent category)
router.delete('/floors/:id', async (req, res) => {
  try {
    const floorId = parseInt(req.params.id);
    
    if (isNaN(floorId)) {
      return res.status(400).json({
        error: 'Invalid floor ID',
        message: 'Floor ID must be a number'
      });
    }

    // Check if floor exists
    const floor = await executeQuery('SELECT id FROM tenant_categories WHERE id = ? AND parent_id IS NULL', [floorId]);
    if (floor.length === 0) {
      return res.status(404).json({
        error: 'Floor not found',
        message: 'Floor not found'
      });
    }

    // Delete floor (child categories will be deleted automatically due to CASCADE)
    await executeQuery('DELETE FROM tenant_categories WHERE id = ?', [floorId]);

    // Clear cache
    try {
      await cache.del('floors:list');
      await cache.del('categories:list');
    } catch (cacheError) {
      console.log('Cache clear failed (non-critical):', cacheError.message);
    }

    res.json({
      success: true,
      message: 'Floor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting floor:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete floor'
    });
  }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    
    if (isNaN(categoryId)) {
      return res.status(400).json({
        error: 'Invalid category ID',
        message: 'Category ID must be a number'
      });
    }

    // Check if category exists
    const category = await executeQuery('SELECT id FROM tenant_categories WHERE id = ?', [categoryId]);
    if (category.length === 0) {
      return res.status(404).json({
        error: 'Category not found',
        message: 'Category not found'
      });
    }

    // Delete category
    await executeQuery('DELETE FROM tenant_categories WHERE id = ?', [categoryId]);

    // Clear cache
    try {
      await cache.del('categories:list');
    } catch (cacheError) {
      console.log('Cache clear failed (non-critical):', cacheError.message);
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete category'
    });
  }
});

module.exports = router;
