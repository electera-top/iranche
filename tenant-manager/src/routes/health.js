const express = require('express');
const { executeQuery } = require('../config/database');
const { cache } = require('../config/redis');

const router = express.Router();

// Basic health check
router.get('/', async (req, res) => {
  try {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const healthChecks = {
      application: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
      },
      database: {
        status: 'unknown',
        timestamp: new Date().toISOString()
      },
      redis: {
        status: 'unknown',
        timestamp: new Date().toISOString()
      }
    };

    // Check database
    try {
      await executeQuery('SELECT 1 as health');
      healthChecks.database.status = 'healthy';
    } catch (error) {
      healthChecks.database.status = 'unhealthy';
      healthChecks.database.error = error.message;
    }

    // Check Redis
    try {
      await cache.set('health:check', 'ok', 60);
      const redisCheck = await cache.get('health:check');
      healthChecks.redis.status = redisCheck === 'ok' ? 'healthy' : 'unhealthy';
    } catch (error) {
      healthChecks.redis.status = 'unhealthy';
      healthChecks.redis.error = error.message;
    }

    // Determine overall status
    const overallStatus = Object.values(healthChecks).every(check => check.status === 'healthy') ? 'healthy' : 'degraded';

    res.status(200).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: healthChecks
    });

  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Database health check
router.get('/database', async (req, res) => {
  try {
    const startTime = Date.now();
    await executeQuery('SELECT 1 as health');
    const responseTime = Date.now() - startTime;

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: process.env.DB_NAME || 'shop_management'
    });

  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      database: process.env.DB_NAME || 'shop_management'
    });
  }
});

// Redis health check
router.get('/redis', async (req, res) => {
  try {
    const startTime = Date.now();
    await cache.set('health:redis', 'ok', 60);
    const redisCheck = await cache.get('health:redis');
    const responseTime = Date.now() - startTime;

    if (redisCheck !== 'ok') {
      throw new Error('Redis check failed');
    }

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      redis_url: process.env.REDIS_URL || 'redis://redis:6379'
    });

  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      redis_url: process.env.REDIS_URL || 'redis://redis:6379'
    });
  }
});

// System resources health check
router.get('/resources', async (req, res) => {
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    // Get memory usage
    const { stdout: memoryInfo } = await execAsync('free -m | grep Mem');
    const memoryValues = memoryInfo.split(/\s+/);
    const totalMemory = parseInt(memoryValues[1]);
    const usedMemory = parseInt(memoryValues[2]);
    const memoryUsage = Math.round((usedMemory / totalMemory) * 100);

    // Get disk usage
    const { stdout: diskInfo } = await execAsync('df -h / | tail -1');
    const diskValues = diskInfo.split(/\s+/);
    const diskUsage = parseInt(diskValues[4].replace('%', ''));

    // Get CPU usage
    const { stdout: cpuInfo } = await execAsync("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | awk -F'%' '{print $1}'");
    const cpuUsage = parseFloat(cpuInfo);

    // Get load average
    const { stdout: loadInfo } = await execAsync('uptime | awk -F\'load average:\' \'{print $2}\'');
    const loadAverage = loadInfo.trim().split(',').map(load => parseFloat(load.trim()));

    const resources = {
      memory: {
        total: `${totalMemory}MB`,
        used: `${usedMemory}MB`,
        usage: `${memoryUsage}%`,
        status: memoryUsage < 80 ? 'healthy' : 'warning'
      },
      disk: {
        usage: `${diskUsage}%`,
        status: diskUsage < 90 ? 'healthy' : 'warning'
      },
      cpu: {
        usage: `${cpuUsage}%`,
        status: cpuUsage < 80 ? 'healthy' : 'warning'
      },
      load: {
        '1min': loadAverage[0],
        '5min': loadAverage[1],
        '15min': loadAverage[2],
        status: loadAverage[0] < 1.0 ? 'healthy' : 'warning'
      }
    };

    // Determine overall status
    const overallStatus = Object.values(resources).every(resource => resource.status === 'healthy') ? 'healthy' : 'warning';

    res.status(200).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      resources
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Tenant health check
router.get('/tenants', async (req, res) => {
  try {
    // Get tenant statistics
    const tenantStats = await executeQuery(`
      SELECT 
        COUNT(*) as total_tenants,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_tenants,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tenants,
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_tenants
      FROM tenants
    `);

    const stats = tenantStats[0];
    const activePercentage = stats.total_tenants > 0 ? Math.round((stats.active_tenants / stats.total_tenants) * 100) : 0;

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      tenants: {
        total: stats.total_tenants,
        active: stats.active_tenants,
        pending: stats.pending_tenants,
        suspended: stats.suspended_tenants,
        activePercentage: `${activePercentage}%`
      }
    });

  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Readiness probe
router.get('/ready', async (req, res) => {
  try {
    // Check if application is ready to serve requests
    const checks = {
      database: false,
      redis: false
    };

    // Check database
    try {
      await executeQuery('SELECT 1 as health');
      checks.database = true;
    } catch (error) {
      console.error('Database not ready:', error.message);
    }

    // Check Redis
    try {
      await cache.set('ready:check', 'ok', 60);
      const redisCheck = await cache.get('ready:check');
      checks.redis = redisCheck === 'ok';
    } catch (error) {
      console.error('Redis not ready:', error.message);
    }

    const isReady = Object.values(checks).every(check => check === true);

    if (isReady) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        checks
      });
    }

  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Liveness probe
router.get('/live', async (req, res) => {
  try {
    // Simple check to see if the application is alive
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      pid: process.pid
    });
  } catch (error) {
    res.status(500).json({
      status: 'dead',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;
