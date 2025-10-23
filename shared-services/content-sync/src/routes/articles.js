const express = require('express');
const router = express.Router();
const db = require('../config/database');
const redis = require('../config/redis');

// Get all articles with filters and pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, tenant_id, search } = req.query;
    const offset = (page - 1) * limit;
    const filters = { status, category, tenant_id, search };
    
    // Check cache first
    const cacheKey = `list:${JSON.stringify(filters)}:${page}:${limit}`;
    const cached = await redis.getCachedArticles(cacheKey);
    
    if (cached) {
      return res.json({ success: true, data: cached.articles, pagination: cached.pagination, cached: true });
    }

    const articles = await db.getAllArticles({ ...filters, limit: parseInt(limit), offset: parseInt(offset) });
    
    // Get total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM global_articles ga LEFT JOIN tenants t ON ga.tenant_id = t.id WHERE 1=1`;
    const countResult = await db.query(countSql);
    const total = countResult[0].total;

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    };

    const result = { articles, pagination };
    await redis.cacheArticles(cacheKey, result, 1800);

    res.json({ success: true, data: articles, pagination, cached: false });

  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Search articles
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Search query must be at least 2 characters long' });
    }

    const offset = (page - 1) * limit;
    const cacheKey = `search:${q}:${page}:${limit}`;
    const cached = await redis.getCachedSearchResults(cacheKey);
    
    if (cached) {
      return res.json({ success: true, data: cached.articles, pagination: cached.pagination, query: q, cached: true });
    }

    const articles = await db.searchArticles(q, { limit: parseInt(limit), offset: parseInt(offset) });
    
    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: articles.length,
      pages: Math.ceil(articles.length / limit),
      hasNext: page * limit < articles.length,
      hasPrev: page > 1
    };

    const result = { articles, pagination };
    await redis.cacheSearchResults(cacheKey, result, 900);

    res.json({ success: true, data: articles, pagination, query: q, cached: false });

  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const cached = await redis.getCachedArticle(id);
    if (cached) {
      db.updateArticleViews(id).catch(console.error);
      return res.json({ success: true, data: cached, cached: true });
    }

    const article = await db.getArticleById(id);
    
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    await redis.cacheArticle(id, article, 3600);
    db.updateArticleViews(id).catch(console.error);

    res.json({ success: true, data: article, cached: false });

  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const cached = await redis.getCachedCategories();
    if (cached) {
      return res.json({ success: true, data: cached, cached: true });
    }

    const categories = await db.getCategories();
    await redis.cacheCategories(categories, 7200);

    res.json({ success: true, data: categories, cached: false });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get article statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const cached = await redis.getCachedStatistics();
    if (cached) {
      return res.json({ success: true, data: cached, cached: true });
    }

    const stats = await db.getArticleStatistics();
    await redis.cacheStatistics(stats, 1800);

    res.json({ success: true, data: stats, cached: false });

  } catch (error) {
    console.error('Error fetching article statistics:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Sync article from tenant (internal API)
router.post('/sync', async (req, res) => {
  try {
    const articleData = req.body;
    
    if (!articleData.tenant_id || !articleData.title || !articleData.slug) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const result = await db.syncArticleFromTenant(articleData);
    
    // Invalidate caches
    await redis.invalidateArticleCache(articleData.id || articleData.slug);
    await redis.invalidateTenantCache(articleData.tenant_id);

    res.json({ success: true, message: 'Article synced successfully', data: result });

  } catch (error) {
    console.error('Error syncing article:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
