const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'main-db',
  user: process.env.DB_USER || 'shop_user',
  password: process.env.DB_PASSWORD || 'your_secure_password',
  database: process.env.DB_NAME || 'shop_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Product Aggregator Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Product Aggregator Database connection failed:', error.message);
    return false;
  }
};

// Execute query with error handling
const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Product Aggregator Database query error:', error);
    throw error;
  }
};

// Get all products from all tenants
const getAllProducts = async (filters = {}) => {
  try {
    let query = `
      SELECT 
        gp.*,
        t.subdomain,
        t.shop_name
      FROM global_products gp
      JOIN tenants t ON gp.tenant_id = t.id
      WHERE gp.is_active = 1
    `;
    
    const params = [];
    
    if (filters.category) {
      query += ' AND gp.category = ?';
      params.push(filters.category);
    }
    
    if (filters.brand) {
      query += ' AND gp.brand = ?';
      params.push(filters.brand);
    }
    
    if (filters.price_min) {
      query += ' AND gp.price >= ?';
      params.push(filters.price_min);
    }
    
    if (filters.price_max) {
      query += ' AND gp.price <= ?';
      params.push(filters.price_max);
    }
    
    if (filters.tenant_id) {
      query += ' AND gp.tenant_id = ?';
      params.push(filters.tenant_id);
    }
    
    query += ' ORDER BY gp.rating DESC, gp.created_at DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }
    
    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
    
    return await executeQuery(query, params);
  } catch (error) {
    console.error('Error getting all products:', error);
    throw error;
  }
};

// Search products
const searchProducts = async (searchTerm, filters = {}) => {
  try {
    let query = `
      SELECT 
        gp.*,
        t.subdomain,
        t.shop_name
      FROM global_products gp
      JOIN tenants t ON gp.tenant_id = t.id
      WHERE gp.is_active = 1
      AND (
        MATCH(gp.product_name, gp.product_description, gp.category, gp.brand) 
        AGAINST(? IN BOOLEAN MODE)
        OR gp.product_name LIKE ?
        OR gp.product_description LIKE ?
        OR gp.category LIKE ?
        OR gp.brand LIKE ?
      )
    `;
    
    const searchParam = `%${searchTerm}%`;
    const params = [searchTerm, searchParam, searchParam, searchParam, searchParam];
    
    if (filters.category) {
      query += ' AND gp.category = ?';
      params.push(filters.category);
    }
    
    if (filters.brand) {
      query += ' AND gp.brand = ?';
      params.push(filters.brand);
    }
    
    if (filters.price_min) {
      query += ' AND gp.price >= ?';
      params.push(filters.price_min);
    }
    
    if (filters.price_max) {
      query += ' AND gp.price <= ?';
      params.push(filters.price_max);
    }
    
    query += ' ORDER BY gp.rating DESC, gp.created_at DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }
    
    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
    
    return await executeQuery(query, params);
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Get product categories
const getCategories = async () => {
  try {
    const query = `
      SELECT 
        category,
        COUNT(*) as product_count
      FROM global_products
      WHERE is_active = 1 AND category IS NOT NULL
      GROUP BY category
      ORDER BY product_count DESC
    `;
    
    return await executeQuery(query);
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Get product brands
const getBrands = async () => {
  try {
    const query = `
      SELECT 
        brand,
        COUNT(*) as product_count,
        AVG(rating) as avg_rating
      FROM global_products
      WHERE is_active = 1 AND brand IS NOT NULL
      GROUP BY brand
      ORDER BY avg_rating DESC, product_count DESC
    `;
    
    return await executeQuery(query);
  } catch (error) {
    console.error('Error getting brands:', error);
    throw error;
  }
};

// Get product statistics
const getProductStats = async () => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_products,
        COUNT(DISTINCT tenant_id) as total_shops,
        COUNT(DISTINCT category) as total_categories,
        COUNT(DISTINCT brand) as total_brands,
        AVG(price) as avg_price,
        AVG(rating) as avg_rating,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM global_products
      WHERE is_active = 1
    `;
    
    const result = await executeQuery(query);
    return result[0];
  } catch (error) {
    console.error('Error getting product stats:', error);
    throw error;
  }
};

module.exports = {
  pool,
  executeQuery,
  testConnection,
  getAllProducts,
  searchProducts,
  getCategories,
  getBrands,
  getProductStats
};
