const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'main-db',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'shop_user',
  password: process.env.DB_PASSWORD || 'your_secure_password',
  database: process.env.DB_NAME || 'shop_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Content Sync Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Content Sync Database connection failed:', error.message);
    return false;
  }
}

// Execute a query
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Execute a transaction
async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Article management functions
async function getAllArticles(filters = {}) {
  let sql = `
    SELECT 
      ga.*,
      t.subdomain,
      t.shop_name,
      t.status as tenant_status
    FROM global_articles ga
    LEFT JOIN tenants t ON ga.tenant_id = t.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (filters.status) {
    sql += ' AND ga.status = ?';
    params.push(filters.status);
  }
  
  if (filters.category) {
    sql += ' AND ga.category = ?';
    params.push(filters.category);
  }
  
  if (filters.tenant_id) {
    sql += ' AND ga.tenant_id = ?';
    params.push(filters.tenant_id);
  }
  
  if (filters.search) {
    sql += ' AND (ga.title LIKE ? OR ga.content LIKE ? OR ga.excerpt LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  sql += ' ORDER BY ga.created_at DESC';
  
  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(filters.limit));
  }
  
  if (filters.offset) {
    sql += ' OFFSET ?';
    params.push(parseInt(filters.offset));
  }
  
  return await query(sql, params);
}

async function searchArticles(searchTerm, filters = {}) {
  let sql = `
    SELECT 
      ga.*,
      t.subdomain,
      t.shop_name,
      t.status as tenant_status
    FROM global_articles ga
    LEFT JOIN tenants t ON ga.tenant_id = t.id
    WHERE (
      MATCH(ga.title, ga.content, ga.excerpt) AGAINST(? IN BOOLEAN MODE)
      OR ga.title LIKE ?
      OR ga.content LIKE ?
      OR ga.excerpt LIKE ?
    )
  `;
  
  const params = [searchTerm, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];
  
  if (filters.status) {
    sql += ' AND ga.status = ?';
    params.push(filters.status);
  }
  
  if (filters.category) {
    sql += ' AND ga.category = ?';
    params.push(filters.category);
  }
  
  if (filters.tenant_id) {
    sql += ' AND ga.tenant_id = ?';
    params.push(filters.tenant_id);
  }
  
  sql += ' ORDER BY ga.created_at DESC';
  
  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(filters.limit));
  }
  
  if (filters.offset) {
    sql += ' OFFSET ?';
    params.push(parseInt(filters.offset));
  }
  
  return await query(sql, params);
}

async function getArticleById(id) {
  const sql = `
    SELECT 
      ga.*,
      t.subdomain,
      t.shop_name,
      t.status as tenant_status
    FROM global_articles ga
    LEFT JOIN tenants t ON ga.tenant_id = t.id
    WHERE ga.id = ?
  `;
  
  const articles = await query(sql, [id]);
  return articles.length > 0 ? articles[0] : null;
}

async function getArticleBySlug(slug) {
  const sql = `
    SELECT 
      ga.*,
      t.subdomain,
      t.shop_name,
      t.status as tenant_status
    FROM global_articles ga
    LEFT JOIN tenants t ON ga.tenant_id = t.id
    WHERE ga.slug = ?
  `;
  
  const articles = await query(sql, [slug]);
  return articles.length > 0 ? articles[0] : null;
}

async function getCategories() {
  const sql = `
    SELECT 
      category,
      COUNT(*) as article_count
    FROM global_articles
    WHERE status = 'published'
    GROUP BY category
    ORDER BY article_count DESC
  `;
  
  return await query(sql);
}

async function getArticlesByCategory(category, filters = {}) {
  let sql = `
    SELECT 
      ga.*,
      t.subdomain,
      t.shop_name,
      t.status as tenant_status
    FROM global_articles ga
    LEFT JOIN tenants t ON ga.tenant_id = t.id
    WHERE ga.category = ? AND ga.status = 'published'
  `;
  
  const params = [category];
  
  if (filters.tenant_id) {
    sql += ' AND ga.tenant_id = ?';
    params.push(filters.tenant_id);
  }
  
  sql += ' ORDER BY ga.created_at DESC';
  
  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(filters.limit));
  }
  
  if (filters.offset) {
    sql += ' OFFSET ?';
    params.push(parseInt(filters.offset));
  }
  
  return await query(sql, params);
}

async function getArticlesByTenant(tenantId, filters = {}) {
  let sql = `
    SELECT 
      ga.*,
      t.subdomain,
      t.shop_name,
      t.status as tenant_status
    FROM global_articles ga
    LEFT JOIN tenants t ON ga.tenant_id = t.id
    WHERE ga.tenant_id = ?
  `;
  
  const params = [tenantId];
  
  if (filters.status) {
    sql += ' AND ga.status = ?';
    params.push(filters.status);
  }
  
  if (filters.category) {
    sql += ' AND ga.category = ?';
    params.push(filters.category);
  }
  
  sql += ' ORDER BY ga.created_at DESC';
  
  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(filters.limit));
  }
  
  if (filters.offset) {
    sql += ' OFFSET ?';
    params.push(parseInt(filters.offset));
  }
  
  return await query(sql, params);
}

async function getArticleStatistics() {
  const sql = `
    SELECT 
      COUNT(*) as total_articles,
      COUNT(CASE WHEN status = 'published' THEN 1 END) as published_articles,
      COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_articles,
      COUNT(DISTINCT tenant_id) as active_tenants,
      COUNT(DISTINCT category) as total_categories,
      AVG(rating) as average_rating,
      MAX(created_at) as latest_article
    FROM global_articles
  `;
  
  const stats = await query(sql);
  return stats[0];
}

async function syncArticleFromTenant(articleData) {
  const sql = `
    INSERT INTO global_articles (
      tenant_id, title, slug, content, excerpt, category, 
      author, featured_image, tags, status, rating, 
      view_count, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      content = VALUES(content),
      excerpt = VALUES(excerpt),
      category = VALUES(category),
      author = VALUES(author),
      featured_image = VALUES(featured_image),
      tags = VALUES(tags),
      status = VALUES(status),
      rating = VALUES(rating),
      view_count = VALUES(view_count),
      updated_at = VALUES(updated_at)
  `;
  
  const params = [
    articleData.tenant_id,
    articleData.title,
    articleData.slug,
    articleData.content,
    articleData.excerpt,
    articleData.category,
    articleData.author,
    articleData.featured_image,
    articleData.tags,
    articleData.status,
    articleData.rating || 0,
    articleData.view_count || 0,
    articleData.created_at,
    articleData.updated_at
  ];
  
  return await query(sql, params);
}

async function deleteArticle(id) {
  const sql = 'DELETE FROM global_articles WHERE id = ?';
  return await query(sql, [id]);
}

async function updateArticleViews(id) {
  const sql = 'UPDATE global_articles SET view_count = view_count + 1 WHERE id = ?';
  return await query(sql, [id]);
}

module.exports = {
  pool,
  testConnection,
  query,
  transaction,
  getAllArticles,
  searchArticles,
  getArticleById,
  getArticleBySlug,
  getCategories,
  getArticlesByCategory,
  getArticlesByTenant,
  getArticleStatistics,
  syncArticleFromTenant,
  deleteArticle,
  updateArticleViews
};
