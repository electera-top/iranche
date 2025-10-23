const express = require('express');
const router = express.Router();
const db = require('../config/database');
const redis = require('../config/redis');

// Search products
router.get('/', async (req, res) => {
  try {
    const { q, category, brand, min_price, max_price, sort, page = 1, limit = 20 } = req.query;
    
    // Build search query
    let query = 'SELECT * FROM global_products WHERE 1=1';
    const params = [];
    
    if (q) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (brand) {
      query += ' AND brand = ?';
      params.push(brand);
    }
    
    if (min_price) {
      query += ' AND price >= ?';
      params.push(parseFloat(min_price));
    }
    
    if (max_price) {
      query += ' AND price <= ?';
      params.push(parseFloat(max_price));
    }
    
    // Add sorting
    if (sort) {
      switch (sort) {
        case 'price_asc':
          query += ' ORDER BY price ASC';
          break;
        case 'price_desc':
          query += ' ORDER BY price DESC';
          break;
        case 'name_asc':
          query += ' ORDER BY name ASC';
          break;
        case 'name_desc':
          query += ' ORDER BY name DESC';
          break;
        case 'rating':
          query += ' ORDER BY rating DESC';
          break;
        default:
          query += ' ORDER BY created_at DESC';
      }
    } else {
      query += ' ORDER BY created_at DESC';
    }
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const products = await db.executeQuery(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM global_products WHERE 1=1';
    const countParams = [];
    
    if (q) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${q}%`, `%${q}%`);
    }
    
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    
    if (brand) {
      countQuery += ' AND brand = ?';
      countParams.push(brand);
    }
    
    if (min_price) {
      countQuery += ' AND price >= ?';
      countParams.push(parseFloat(min_price));
    }
    
    if (max_price) {
      countQuery += ' AND price <= ?';
      countParams.push(parseFloat(max_price));
    }
    
    const [{ total }] = await db.executeQuery(countQuery, countParams);
    
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const query = `
      SELECT DISTINCT name, category, brand 
      FROM global_products 
      WHERE name LIKE ? OR category LIKE ? OR brand LIKE ?
      LIMIT 10
    `;
    
    const suggestions = await db.executeQuery(query, [`%${q}%`, `%${q}%`, `%${q}%`]);
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions',
      message: error.message
    });
  }
});

// Get search filters
router.get('/filters', async (req, res) => {
  try {
    const { q, category, brand } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (q) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }
    
    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }
    
    if (brand) {
      whereClause += ' AND brand = ?';
      params.push(brand);
    }
    
    // Get categories
    const categoriesQuery = `SELECT DISTINCT category, COUNT(*) as count FROM global_products ${whereClause} GROUP BY category ORDER BY count DESC`;
    const categories = await db.executeQuery(categoriesQuery, params);
    
    // Get brands
    const brandsQuery = `SELECT DISTINCT brand, COUNT(*) as count FROM global_products ${whereClause} GROUP BY brand ORDER BY count DESC`;
    const brands = await db.executeQuery(brandsQuery, params);
    
    // Get price range
    const priceQuery = `SELECT MIN(price) as min_price, MAX(price) as max_price FROM global_products ${whereClause}`;
    const [priceRange] = await db.executeQuery(priceQuery, params);
    
    res.json({
      success: true,
      data: {
        categories,
        brands,
        priceRange
      }
    });
  } catch (error) {
    console.error('Filters error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get filters',
      message: error.message
    });
  }
});

module.exports = router;
