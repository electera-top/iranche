const express = require('express');
const router = express.Router();
const db = require('../config/database');
const redis = require('../config/redis');
const os = require('os');

// Basic health check
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'content-sync',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const checks = {
      application: { status: 'healthy', details: {} },
      database: { status: 'unhealthy', details: {} },
      redis: { status: 'unhealthy', details: {} }
    };

    // Application check
    checks.application.details = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform
    };

    // Database check
    try {
      const dbStart = Date.now();
      await db.testConnection();
      checks.database.status = 'healthy';
      checks.database.details = {
        responseTime: Date.now() - dbStart,
        connection: 'established'
      };
    } catch (error) {
      checks.database.details = {
        error: error.message,
        connection: 'failed'
      };
    }

    // Redis check
    try {
      const redisStart = Date.now();
      await redis.testConnection();
      checks.redis.status = 'healthy';
      checks.redis.details = {
        responseTime: Date.now() - redisStart,
        connection: 'established'
      };
    } catch (error) {
      checks.redis.details = {
        error: error.message,
        connection: 'failed'
      };
    }

    const overallStatus = Object.values(checks).every(check => check.status === 'healthy') ? 'healthy' : 'degraded';

    res.json({
      status: overallStatus,
      service: 'content-sync',
      timestamp: new Date().toISOString(),
      checks
    });

  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      service: 'content-sync',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database health check
router.get('/database', async (req, res) => {
  try {
    const start = Date.now();
    await db.testConnection();
    const responseTime = Date.now() - start;

    res.json({
      status: 'healthy',
      service: 'content-sync-database',
      responseTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'content-sync-database',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Redis health check
router.get('/redis', async (req, res) => {
  try {
    const start = Date.now();
    await redis.testConnection();
    const responseTime = Date.now() - start;

    res.json({
      status: 'healthy',
      service: 'content-sync-redis',
      responseTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'content-sync-redis',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// System resources health check
router.get('/system', (req, res) => {
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsage = (usedMem / totalMem) * 100;

    const loadAvg = os.loadavg();
    const cpuCount = os.cpus().length;

    const systemInfo = {
      memory: {
        total: totalMem,
        free: freeMem,
        used: usedMem,
        usagePercent: memoryUsage.toFixed(2)
      },
      cpu: {
        loadAverage: loadAvg,
        coreCount: cpuCount,
        loadPercent: (loadAvg[0] / cpuCount) * 100
      },
      uptime: os.uptime(),
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname()
    };

    const isHealthy = memoryUsage < 90 && (loadAvg[0] / cpuCount) < 2;

    res.json({
      status: isHealthy ? 'healthy' : 'warning',
      service: 'content-sync-system',
      data: systemInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      service: 'content-sync-system',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Readiness probe
router.get('/ready', async (req, res) => {
  try {
    const dbReady = await db.testConnection();
    const redisReady = await redis.testConnection();

    if (dbReady && redisReady) {
      res.json({
        status: 'ready',
        service: 'content-sync',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        service: 'content-sync',
        dependencies: {
          database: dbReady,
          redis: redisReady
        },
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      service: 'content-sync',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness probe
router.get('/live', (req, res) => {
  res.json({
    status: 'alive',
    service: 'content-sync',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
