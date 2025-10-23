const redis = require('redis');

const redisConfig = {
  url: process.env.REDIS_URL || 'redis://redis:6379',
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands with a individual error
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // Reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
};

// Create Redis client
const client = redis.createClient(redisConfig);

// Handle connection events
client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('ready', () => {
  console.log('Redis client ready');
});

client.on('error', (err) => {
  console.error('Redis client error:', err);
});

client.on('end', () => {
  console.log('Redis client disconnected');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await client.connect();
    return true;
  } catch (error) {
    console.error('Redis connection failed:', error);
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
      console.error('Redis set error:', error);
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
      console.error('Redis get error:', error);
      return null;
    }
  },

  // Delete cache
  del: async (key) => {
    try {
      await client.del(key);
      return true;
    } catch (error) {
      console.error('Redis del error:', error);
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
      console.error('Redis delMultiple error:', error);
      return false;
    }
  },

  // Check if key exists
  exists: async (key) => {
    try {
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  },

  // Set hash
  hset: async (key, field, value) => {
    try {
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await client.hSet(key, field, serializedValue);
      return true;
    } catch (error) {
      console.error('Redis hset error:', error);
      return false;
    }
  },

  // Get hash
  hget: async (key, field) => {
    try {
      const value = await client.hGet(key, field);
      if (!value) return null;
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Redis hget error:', error);
      return null;
    }
  },

  // Get all hash fields
  hgetall: async (key) => {
    try {
      const hash = await client.hGetAll(key);
      const result = {};
      
      for (const [field, value] of Object.entries(hash)) {
        try {
          result[field] = JSON.parse(value);
        } catch {
          result[field] = value;
        }
      }
      
      return result;
    } catch (error) {
      console.error('Redis hgetall error:', error);
      return {};
    }
  },

  // Increment counter
  incr: async (key) => {
    try {
      return await client.incr(key);
    } catch (error) {
      console.error('Redis incr error:', error);
      return 0;
    }
  },

  // Set with expiration
  setex: async (key, ttl, value) => {
    try {
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await client.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      console.error('Redis setex error:', error);
      return false;
    }
  }
};

// Session management
const session = {
  // Create session
  create: async (userId, data, ttl = 86400) => {
    const sessionId = `session:${userId}:${Date.now()}`;
    const sessionData = {
      userId,
      data,
      createdAt: Date.now(),
      expiresAt: Date.now() + (ttl * 1000)
    };
    
    await cache.set(sessionId, sessionData, ttl);
    return sessionId;
  },

  // Get session
  get: async (sessionId) => {
    return await cache.get(sessionId);
  },

  // Update session
  update: async (sessionId, data) => {
    const session = await cache.get(sessionId);
    if (!session) return false;
    
    session.data = { ...session.data, ...data };
    return await cache.set(sessionId, session, 86400);
  },

  // Delete session
  delete: async (sessionId) => {
    return await cache.del(sessionId);
  },

  // Clean expired sessions
  cleanup: async () => {
    try {
      const sessions = await client.keys('session:*');
      const now = Date.now();
      
      for (const sessionKey of sessions) {
        const session = await cache.get(sessionKey);
        if (session && session.expiresAt < now) {
          await cache.del(sessionKey);
        }
      }
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }
};

module.exports = {
  client,
  connectRedis,
  cache,
  session
};
