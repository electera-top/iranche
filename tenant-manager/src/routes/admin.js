const express = require('express');
const Joi = require('joi');
const { executeQuery } = require('../config/database');
const { cache } = require('../config/redis');
const { getNginxStatus, reloadNginx } = require('../services/nginx');

const router = express.Router();

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Admin token required'
    });
  }
  
  const token = authHeader.substring(7);
  
  // In production, validate against a proper admin token
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid admin token'
    });
  }
  
  next();
};

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    // Get tenant statistics
    const tenantStats = await executeQuery(`
      SELECT 
        COUNT(*) as total_tenants,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_tenants,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tenants,
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_tenants,
        COUNT(CASE WHEN plan_type = 'free' THEN 1 END) as free_tenants,
        COUNT(CASE WHEN plan_type = 'basic' THEN 1 END) as basic_tenants,
        COUNT(CASE WHEN plan_type = 'premium' THEN 1 END) as premium_tenants,
        COUNT(CASE WHEN plan_type = 'enterprise' THEN 1 END) as enterprise_tenants
      FROM tenants
    `);

    // Get storage statistics
    const storageStats = await executeQuery(`
      SELECT 
        SUM(storage_used) as total_storage_used,
        SUM(storage_limit) as total_storage_limit,
        AVG(storage_used) as avg_storage_used
      FROM tenants
    `);

    // Get recent activity
    const recentActivity = await executeQuery(`
      SELECT 
        id, subdomain, shop_name, status, created_at, updated_at
      FROM tenants
      ORDER BY updated_at DESC
      LIMIT 10
    `);

    // Get Nginx status
    const nginxStatus = await getNginxStatus();

    // Get cache statistics
    const cacheStats = await cache.hgetall('system:stats');

    res.json({
      success: true,
      data: {
        tenants: tenantStats[0],
        storage: storageStats[0],
        recentActivity,
        nginx: nginxStatus,
        cache: cacheStats
      }
    });

  } catch (error) {
    console.error('Error getting system stats:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get system statistics'
    });
  }
});

// Get system settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await executeQuery('SELECT * FROM system_settings ORDER BY setting_key');
    
    const formattedSettings = {};
    settings.forEach(setting => {
      formattedSettings[setting.setting_key] = {
        value: setting.setting_value,
        type: setting.setting_type,
        description: setting.setting_description
      };
    });

    res.json({
      success: true,
      data: formattedSettings
    });

  } catch (error) {
    console.error('Error getting system settings:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get system settings'
    });
  }
});

// Update system settings
router.put('/settings', async (req, res) => {
  try {
    const { error, value } = Joi.object({
      settings: Joi.object().required()
    }).validate(req.body);

    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const { settings } = value;

    for (const [key, setting] of Object.entries(settings)) {
      await executeQuery(
        'UPDATE system_settings SET setting_value = ? WHERE setting_key = ?',
        [setting.value, key]
      );
    }

    // Clear cache
    await cache.del('system:settings');

    res.json({
      success: true,
      message: 'System settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update system settings'
    });
  }
});

// Get tenant analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    // Get tenant growth over time
    const growthData = await executeQuery(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_tenants
      FROM tenants
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [period]);

    // Get plan distribution
    const planDistribution = await executeQuery(`
      SELECT 
        plan_type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tenants), 2) as percentage
      FROM tenants
      GROUP BY plan_type
    `);

    // Get status distribution
    const statusDistribution = await executeQuery(`
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tenants), 2) as percentage
      FROM tenants
      GROUP BY status
    `);

    // Get storage usage statistics
    const storageUsage = await executeQuery(`
      SELECT 
        subdomain,
        shop_name,
        storage_used,
        storage_limit,
        ROUND((storage_used * 100.0 / storage_limit), 2) as usage_percentage
      FROM tenants
      WHERE storage_used > 0
      ORDER BY usage_percentage DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        growth: growthData,
        planDistribution,
        statusDistribution,
        storageUsage
      }
    });

  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get analytics data'
    });
  }
});

// Get system health
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbHealth = await executeQuery('SELECT 1 as health');
    const dbStatus = dbHealth.length > 0 ? 'healthy' : 'unhealthy';

    // Check Redis connection
    const redisHealth = await cache.get('health:check');
    const redisStatus = redisHealth !== null ? 'healthy' : 'unhealthy';

    // Get Nginx status
    const nginxStatus = await getNginxStatus();

    // Check disk space
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    const { stdout: diskUsage } = await execAsync('df -h / | tail -1 | awk \'{print $5}\'');
    const diskStatus = parseInt(diskUsage.replace('%', '')) < 90 ? 'healthy' : 'warning';

    // Check memory usage
    const { stdout: memoryInfo } = await execAsync('free -m | grep Mem');
    const memoryValues = memoryInfo.split(/\s+/);
    const totalMemory = parseInt(memoryValues[1]);
    const usedMemory = parseInt(memoryValues[2]);
    const memoryUsage = Math.round((usedMemory / totalMemory) * 100);
    const memoryStatus = memoryUsage < 80 ? 'healthy' : 'warning';

    res.json({
      success: true,
      data: {
        database: {
          status: dbStatus,
          timestamp: new Date().toISOString()
        },
        redis: {
          status: redisStatus,
          timestamp: new Date().toISOString()
        },
        nginx: {
          status: nginxStatus.status,
          configValid: nginxStatus.configValid,
          timestamp: new Date().toISOString()
        },
        disk: {
          status: diskStatus,
          usage: diskUsage.trim(),
          timestamp: new Date().toISOString()
        },
        memory: {
          status: memoryStatus,
          usage: `${memoryUsage}%`,
          total: `${totalMemory}MB`,
          used: `${usedMemory}MB`,
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Error getting system health:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get system health'
    });
  }
});

// Reload Nginx configuration
router.post('/nginx/reload', async (req, res) => {
  try {
    await reloadNginx();
    
    res.json({
      success: true,
      message: 'Nginx configuration reloaded successfully'
    });

  } catch (error) {
    console.error('Error reloading Nginx:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to reload Nginx configuration'
    });
  }
});

// Clear system cache
router.post('/cache/clear', async (req, res) => {
  try {
    // Clear all cache
    await cache.delMultiple('*');
    
    res.json({
      success: true,
      message: 'System cache cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to clear system cache'
    });
  }
});

// Get system logs
router.get('/logs', async (req, res) => {
  try {
    const { type = 'all', limit = 100 } = req.query;
    
    let logs = [];
    
    if (type === 'all' || type === 'nginx') {
      // Get Nginx logs
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      try {
        const { stdout: nginxLogs } = await execAsync(`tail -n ${limit} /var/log/nginx/error.log`);
        logs.push({
          type: 'nginx',
          content: nginxLogs
        });
      } catch (error) {
        logs.push({
          type: 'nginx',
          content: 'No nginx logs available'
        });
      }
    }
    
    if (type === 'all' || type === 'application') {
      // Get application logs
      logs.push({
        type: 'application',
        content: 'Application logs would be here in production'
      });
    }

    res.json({
      success: true,
      data: logs
    });

  } catch (error) {
    console.error('Error getting logs:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get system logs'
    });
  }
});

// Backup system
router.post('/backup', async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `/var/www/backups/system-${timestamp}`;
    
    // Create backup directory
    const fs = require('fs').promises;
    await fs.mkdir(backupPath, { recursive: true });
    
    // Backup database
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    await execAsync(`mysqldump -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${backupPath}/database.sql`);
    
    // Backup tenant directories
    await execAsync(`tar -czf ${backupPath}/tenants.tar.gz -C /var/www tenants/`);
    
    res.json({
      success: true,
      message: 'System backup created successfully',
      data: {
        backupPath,
        timestamp
      }
    });

  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create system backup'
    });
  }
});

module.exports = router;
