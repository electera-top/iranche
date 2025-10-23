const redis = require('redis');

const redisConfig = {
  url: process.env.REDIS_URL || 'redis://redis:6379',
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
};

// Create Redis client
const client = redis.createClient(redisConfig);

// Handle connection events
client.on('connect', () => {
  console.log('Product Aggregator Redis client connected');
});

client.on('ready', () => {
  console.log('Product Aggregator Redis client ready');
});

client.on('error', (err) => {
  console.error('Product Aggregator Redis client error:', err);
});

client.on('end', () => {
  console.log('Product Aggregator Redis client disconnected');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await client.connect();
    return true;
  } catch (error) {
    console.error('Product Aggregator Redis connection failed:', error);
    return false;
  }
};

// Cache operations
const cache = {
  // Set cache with TTL
  set: async (key, value, ttl = 3600) => {
    try {
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await client.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      console.error('Product Aggregator Redis set error:', error);
      return false;
    }
  },

  // Get cache
  get: async (key) => {
    try {
      const value = await client.get(key);
      if (!value) return null;
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Product Aggregator Redis get error:', error);
      return null;
    }
  },

  // Delete cache
  del: async (key) => {
    try {
      await client.del(key);
      return true;
    } catch (error) {
      console.error('Product Aggregator Redis del error:', error);
      return false;
    }
  },

  // Delete multiple keys
  delMultiple: async (pattern) => {
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Product Aggregator Redis delMultiple error:', error);
      return false;
    }
  },

  // Check if key exists
  exists: async (key) => {
    try {
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Product Aggregator Redis exists error:', error);
      return false;
    }
  }
};

module.exports = {
  client,
  connectRedis,
  cache
};
