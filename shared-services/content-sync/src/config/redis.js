const redis = require('redis');
require('dotenv').config();

// Redis client configuration
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || 'your_redis_password',
  retry_strategy: function(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      console.error('Redis server refused connection');
      return new Error('Redis server refused connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      console.error('Redis retry time exhausted');
      return new Error('Redis retry time exhausted');
    }
    if (options.attempt > 10) {
      console.error('Redis max attempts reached');
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

// Connect to Redis
redisClient.on('connect', () => {
  console.log('✅ Content Sync Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.error('❌ Content Sync Redis connection error:', err);
});

redisClient.on('ready', () => {
  console.log('✅ Content Sync Redis ready');
});

redisClient.on('end', () => {
  console.log('Content Sync Redis connection ended');
});

// Test Redis connection
async function testConnection() {
  try {
    await redisClient.ping();
    console.log('✅ Content Sync Redis ping successful');
    return true;
  } catch (error) {
    console.error('❌ Content Sync Redis ping failed:', error.message);
    return false;
  }
}

// Cache utility functions
async function setCache(key, data, ttl = 3600) {
  try {
    const serializedData = JSON.stringify(data);
    await redisClient.setex(key, ttl, serializedData);
    return true;
  } catch (error) {
    console.error('Redis set cache error:', error);
    return false;
  }
}

async function getCache(key) {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get cache error:', error);
    return null;
  }
}

async function deleteCache(key) {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete cache error:', error);
    return false;
  }
}

async function clearCache(pattern = 'content_sync:*') {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Redis clear cache error:', error);
    return false;
  }
}

// Article-specific cache functions
async function cacheArticles(key, articles, ttl = 1800) {
  return await setCache(`content_sync:articles:${key}`, articles, ttl);
}

async function getCachedArticles(key) {
  return await getCache(`content_sync:articles:${key}`);
}

async function cacheArticle(key, article, ttl = 3600) {
  return await setCache(`content_sync:article:${key}`, article, ttl);
}

async function getCachedArticle(key) {
  return await getCache(`content_sync:article:${key}`);
}

async function cacheCategories(categories, ttl = 7200) {
  return await setCache('content_sync:categories', categories, ttl);
}

async function getCachedCategories() {
  return await getCache('content_sync:categories');
}

async function cacheStatistics(stats, ttl = 1800) {
  return await setCache('content_sync:statistics', stats, ttl);
}

async function getCachedStatistics() {
  return await getCache('content_sync:statistics');
}

// Search cache functions
async function cacheSearchResults(query, results, ttl = 900) {
  const searchKey = `content_sync:search:${Buffer.from(query).toString('base64')}`;
  return await setCache(searchKey, results, ttl);
}

async function getCachedSearchResults(query) {
  const searchKey = `content_sync:search:${Buffer.from(query).toString('base64')}`;
  return await getCache(searchKey);
}

// Invalidate cache functions
async function invalidateArticleCache(articleId) {
  await deleteCache(`content_sync:article:${articleId}`);
  await deleteCache(`content_sync:article:slug:*`);
  await clearCache('content_sync:articles:*');
  await deleteCache('content_sync:statistics');
}

async function invalidateTenantCache(tenantId) {
  await clearCache(`content_sync:articles:tenant:${tenantId}:*`);
  await clearCache(`content_sync:search:*`);
  await deleteCache('content_sync:statistics');
}

async function invalidateCategoryCache(category) {
  await clearCache(`content_sync:articles:category:${category}:*`);
  await deleteCache('content_sync:categories');
  await deleteCache('content_sync:statistics');
}

// Rate limiting functions
async function checkRateLimit(key, limit = 100, window = 3600) {
  try {
    const current = await redisClient.incr(`rate_limit:${key}`);
    if (current === 1) {
      await redisClient.expire(`rate_limit:${key}`, window);
    }
    return current <= limit;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return true; // Allow if Redis fails
  }
}

async function getRateLimitInfo(key) {
  try {
    const current = await redisClient.get(`rate_limit:${key}`);
    const ttl = await redisClient.ttl(`rate_limit:${key}`);
    return {
      current: parseInt(current) || 0,
      ttl: ttl > 0 ? ttl : 0
    };
  } catch (error) {
    console.error('Rate limit info error:', error);
    return { current: 0, ttl: 0 };
  }
}

// Health check function
async function getRedisHealth() {
  try {
    const start = Date.now();
    await redisClient.ping();
    const responseTime = Date.now() - start;
    
    const info = await redisClient.info();
    const memory = await redisClient.info('memory');
    
    return {
      status: 'healthy',
      responseTime,
      info: info.split('\r\n').slice(0, 10).join('\n'),
      memory: memory.split('\r\n').slice(0, 5).join('\n')
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

module.exports = {
  redisClient,
  testConnection,
  setCache,
  getCache,
  deleteCache,
  clearCache,
  cacheArticles,
  getCachedArticles,
  cacheArticle,
  getCachedArticle,
  cacheCategories,
  getCachedCategories,
  cacheStatistics,
  getCachedStatistics,
  cacheSearchResults,
  getCachedSearchResults,
  invalidateArticleCache,
  invalidateTenantCache,
  invalidateCategoryCache,
  checkRateLimit,
  getRateLimitInfo,
  getRedisHealth
};
