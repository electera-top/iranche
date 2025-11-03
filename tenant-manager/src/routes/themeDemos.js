const express = require('express');
const Joi = require('joi');
const { executeQuery } = require('../config/database');
const mysql = require('mysql2/promise');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateJWT);

// Lazy load Docker client
let Docker, docker;
function getDocker() {
  if (!docker) {
    try {
      Docker = require('dockerode');
      docker = new Docker({ socketPath: '/var/run/docker.sock' });
    } catch (err) {
      throw new Error('Dockerode not installed. Please run: npm install dockerode');
    }
  }
  return docker;
}

// Root database connection for creating databases
const getRootConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST || 'main-db',
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'root_password_123'
  });
};

const schema = Joi.object({
  theme_slug: Joi.string().max(160).required(),
  demo_path: Joi.string().max(255).required(),
  demo_url: Joi.string().uri().max(500).required(),
  wp_site_id: Joi.number().integer().allow(null).optional(),
  status: Joi.string().valid('active','inactive','building','error').optional(),
  snapshot_ref: Joi.string().max(255).allow(null, '').optional(),
  notes: Joi.string().max(500).allow(null, '').optional()
});

const updateSchema = schema.fork(['theme_slug','demo_path','demo_url'], (f) => f.optional());

// Install WordPress for theme demos
router.post('/install-wordpress', async (req, res) => {
  try {
    const WP_ROOT = '/var/www/themes';
    
    // Check if WordPress is already installed
    try {
      const { stdout } = await execAsync(`docker exec shop_wordpress_core test -f ${WP_ROOT}/wp-config.php && echo exists || echo not_found`);
      if (stdout.trim() === 'exists') {
        return res.json({ success: true, message: 'WordPress already installed' });
      }
    } catch (e) {
      // Continue with installation
    }

    // First, create database if not exists using root connection
    try {
      const rootConn = await getRootConnection();
      await rootConn.execute('CREATE DATABASE IF NOT EXISTS themes_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
      // GRANT cannot use prepared statements, use query directly
      await rootConn.query('GRANT ALL PRIVILEGES ON themes_demo.* TO \'shop_user\'@\'%\'');
      await rootConn.query('FLUSH PRIVILEGES');
      await rootConn.end();
      console.log('Database themes_demo created');
    } catch (dbErr) {
      // Database might already exist or permissions issue
      console.warn('Database creation warning:', dbErr.message);
    }

    // Install WordPress using WP-CLI in wordpress-core container
    console.log('Installing WordPress for theme demos...');
    
    const container = getDocker().getContainer('shop_wordpress_core');
    
    // Helper function to execute WP-CLI commands
    const execWP = async (cmd) => {
      const exec = await container.exec({
        Cmd: cmd,
        AttachStdout: true,
        AttachStderr: true
      });
      
      const stream = await exec.start({ hijack: true, stdin: false });
      let output = '';
      
      await new Promise((resolve, reject) => {
        container.modem.demuxStream(stream, process.stdout, process.stderr);
        stream.on('data', (chunk) => {
          output += chunk.toString();
        });
        stream.on('end', resolve);
        stream.on('error', reject);
        setTimeout(resolve, 30000); // Timeout after 30 seconds
      });
      
      return output;
    };
    
    // Download WordPress (skip if already exists)
    try {
      await execWP(['test', '-d', `${WP_ROOT}/wp-admin`]).catch(() => {
        return execWP(['wp', 'core', 'download', '--path=' + WP_ROOT, '--allow-root']);
      });
    } catch (e) {
      // Continue
    }
    
    // Create wp-config.php
    try {
      await execWP(['wp', 'core', 'config', '--path=' + WP_ROOT, '--dbname=themes_demo', '--dbuser=shop_user', `--dbpass=${process.env.MYSQL_PASSWORD || 'shop_password_123'}`, '--dbhost=main-db', '--allow-root', '--force']);
    } catch (e) {
      console.warn('wp-config creation warning:', e.message);
    }
    
    // Install WordPress
    await execWP(['wp', 'core', 'install', '--path=' + WP_ROOT, '--url=http://themes.localhost', '--title=Theme Demos', '--admin_user=admin', '--admin_password=admin123', '--admin_email=admin@themes.localhost', '--skip-email', '--allow-root']);
    
    // Install WooCommerce
    await execWP(['wp', 'plugin', 'install', 'woocommerce', '--path=' + WP_ROOT, '--activate', '--allow-root']);
    
    // Import sample products
    await execWP(['wp', 'wc', 'tool', 'run', 'install_pages', '--path=' + WP_ROOT, '--user=1', '--allow-root']).catch(() => {});
    
    res.json({ success: true, message: 'WordPress installed successfully' });
  } catch (err) {
    console.error('WordPress installation error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// Activate theme for demo
router.post('/activate-theme/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const WP_ROOT = '/var/www/themes';
    
    // Get theme info from database
    const themes = await executeQuery(
      `SELECT id, slug, zip_file_id FROM themes WHERE slug = ?`,
      [slug]
    );
    
    if (!themes || themes.length === 0) {
      return res.status(404).json({ error: 'Theme not found in database' });
    }
    
    const theme = themes[0];
    
    // Get wordpress-core container
    const container = getDocker().getContainer('shop_wordpress_core');
    
    // Helper function to execute WP-CLI commands in container
    const execWP = async (cmd) => {
      const execObj = await container.exec({
        Cmd: cmd,
        AttachStdout: true,
        AttachStderr: true,
        User: 'root'
      });
      
      const stream = await execObj.start({ hijack: true, stdin: false });
      
      return new Promise((resolve, reject) => {
        let output = '';
        let errorOutput = '';
        
        // Demux stream into stdout and stderr
        container.modem.demuxStream(stream, {
          write: (chunk) => {
            output += chunk.toString();
          }
        }, {
          write: (chunk) => {
            errorOutput += chunk.toString();
          }
        });
        
        stream.on('end', () => {
          resolve({ stdout: output, stderr: errorOutput });
        });
        
        stream.on('error', (err) => {
          reject(err);
        });
        
        // Timeout after 15 seconds
        setTimeout(() => {
          resolve({ stdout: output, stderr: errorOutput });
        }, 15000);
      });
    };
    
    // Check if theme exists in WordPress
    let themeExists = false;
    try {
      const result = await execWP(['wp', 'theme', 'list', '--path=/var/www/themes', '--field=name', '--allow-root']);
      const themeList = result.stdout.trim().split('\n').filter(t => t && !t.startsWith('name') && t.trim());
      themeExists = themeList.includes(slug);
    } catch (checkErr) {
      console.warn('Theme check error:', checkErr.message);
      // Continue to try installation
    }
    
    // If theme doesn't exist in WordPress, extract it first
    if (!themeExists) {
      if (!theme.zip_file_id) {
        return res.status(400).json({ error: 'Theme zip file not found. Please upload a zip file for this theme first.' });
      }
      
      console.log(`Theme ${slug} not found in WordPress. Extracting from zip file...`);
      
      // Import theme extractor
      const { extractThemeZip } = require('../services/themeExtractor');
      
      // Update theme_demos status to 'building'
      await executeQuery(
        `UPDATE theme_demos SET status = 'building', updated_at = CURRENT_TIMESTAMP WHERE theme_slug = ?`,
        [slug]
      ).catch(() => {
        // Create if doesn't exist
        return executeQuery(
          `INSERT INTO theme_demos (theme_slug, demo_path, demo_url, status) VALUES (?, ?, ?, 'building')`,
          [slug, `/var/www/themes/wp-content/themes/${slug}`, `${process.env.THEME_DEMO_BASE || 'http://themes.localhost'}/${slug}/`]
        );
      });
      
      // Extract theme zip file
      const extractResult = await extractThemeZip(theme.zip_file_id, slug);
      
      if (!extractResult.success) {
        await executeQuery(
          `UPDATE theme_demos SET status = 'error', notes = ? WHERE theme_slug = ?`,
          [extractResult.error || 'Extraction failed', slug]
        );
        return res.status(500).json({ error: 'Failed to extract theme', details: extractResult.error });
      }
      
      console.log(`Theme ${slug} extracted successfully. Path: ${extractResult.path}`);
      
      // Install theme in WordPress themes directory
      // extractResult.path is the path where theme was extracted (e.g., /app/themes-demo/theme-slug)
      // We need to copy it to /var/www/themes/wp-content/themes/theme-slug
      const { installThemeInWordPress } = require('../services/themeDemoInstaller');
      const installResult = await installThemeInWordPress(slug, extractResult.path);
      
      if (!installResult.success) {
        console.warn('Failed to install theme in WordPress:', installResult.error);
        await executeQuery(
          `UPDATE theme_demos SET status = 'error', notes = ? WHERE theme_slug = ?`,
          [installResult.error || 'Installation failed', slug]
        );
        return res.status(500).json({ error: 'Failed to install theme in WordPress', details: installResult.error });
      }
      
      console.log(`Theme ${slug} installed in WordPress at: ${installResult.path}`);
      
      // Verify theme is now available
      try {
        const result = await execWP(['wp', 'theme', 'list', '--path=/var/www/themes', '--field=name', '--allow-root']);
        console.log('WP theme list stdout:', result.stdout);
        console.log('WP theme list stderr:', result.stderr);
        
        // Parse theme list - split by newline and filter empty lines and header
        const themeList = result.stdout
          .trim()
          .split('\n')
          .map(t => t.trim())
          .filter(t => t && t !== 'name' && !t.startsWith('---'));
        
        console.log('Parsed theme list:', JSON.stringify(themeList));
        console.log('Looking for theme slug:', slug);
        
        // Check exact match
        themeExists = themeList.includes(slug);
        
        if (!themeExists) {
          console.log('Theme not found in WP-CLI list, checking if style.css exists...');
          // Check if theme directory exists with style.css (more reliable check)
          const fs = require('fs').promises;
          const styleCssPath = `/var/www/themes/wp-content/themes/${slug}/style.css`;
          try {
            await fs.access(styleCssPath);
            console.log(`Theme directory exists with style.css at ${styleCssPath}`);
            // Theme files exist, just not recognized by WP-CLI yet - try to activate anyway
            themeExists = true;
            console.log('Theme files found, proceeding with activation');
          } catch (accessErr) {
            console.warn(`Theme directory not found at ${styleCssPath}:`, accessErr.message);
          }
        } else {
          console.log('Theme found in WP-CLI list');
        }
      } catch (verifyErr) {
        console.warn('Theme verification error:', verifyErr.message);
        // Try to check style.css directly
        const fs = require('fs').promises;
        try {
          await fs.access(`/var/www/themes/wp-content/themes/${slug}/style.css`);
          console.log('Theme files exist despite verification error, proceeding');
          themeExists = true;
        } catch {
          // Theme not found
        }
      }
      
      if (!themeExists) {
        return res.status(500).json({ 
          error: 'Theme extracted but not found in WordPress. Please check the zip file structure.', 
          details: `Theme slug: ${slug}, Installed path: ${installResult.path}` 
        });
      }
    }
    
    // Activate theme using WP-CLI
    try {
      const result = await execWP(['wp', 'theme', 'activate', slug, '--path=/var/www/themes', '--allow-root']);
      console.log('Theme activation output:', result.stdout);
      if (result.stderr && !result.stdout.includes('Success')) {
        console.warn('Theme activation warning:', result.stderr);
      }
      // Check if activation was successful
      if (result.stderr && !result.stdout.includes('Success')) {
        throw new Error(`Failed to activate theme: ${result.stderr}`);
      }
    } catch (activateErr) {
      console.error('Theme activation error:', activateErr);
      throw activateErr;
    }
    
    // Get or create theme_demos record
    const demos = await executeQuery(
      `SELECT * FROM theme_demos WHERE theme_slug = ?`,
      [slug]
    );
    
    const themeDemoBase = process.env.THEME_DEMO_BASE || 'http://themes.localhost';
    const demoUrl = `${themeDemoBase}/${slug}/`;
    
    if (demos.length === 0) {
      // Create new theme_demos record
      await executeQuery(
        `INSERT INTO theme_demos (theme_slug, demo_path, demo_url, status) VALUES (?, ?, ?, ?)`,
        [slug, `/var/www/themes/wp-content/themes/${slug}`, demoUrl, 'active']
      );
    } else {
      // Update existing record
      await executeQuery(
        `UPDATE theme_demos SET status = 'active', demo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE theme_slug = ?`,
        [demoUrl, slug]
      );
    }
    
    res.json({ 
      success: true, 
      message: `Theme ${slug} activated successfully`,
      demo_url: demoUrl
    });
  } catch (err) {
    console.error('Theme activation error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// List theme demos
router.get('/', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM theme_demos ORDER BY updated_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('List theme demos error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM theme_demos WHERE theme_slug = ?', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Get theme demo error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });
    const result = await executeQuery(
      `INSERT INTO theme_demos (theme_slug, demo_path, demo_url, wp_site_id, status, snapshot_ref, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [value.theme_slug, value.demo_path, value.demo_url, value.wp_site_id || null, value.status || 'inactive', value.snapshot_ref || null, value.notes || null]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Create theme demo error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:slug', async (req, res) => {
  try {
    const { error, value } = updateSchema.min(1).validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });
    const fields = [];
    const params = [];
    ['demo_path','demo_url','wp_site_id','status','snapshot_ref','notes','theme_slug'].forEach((k) => {
      if (k in value) { fields.push(`${k} = ?`); params.push(value[k]); }
    });
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.slug);
    await executeQuery(`UPDATE theme_demos SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE theme_slug = ?`, params);
    res.json({ success: true });
  } catch (err) {
    console.error('Update theme demo error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const WP_ROOT = '/var/www/themes';
    
    // Get theme demo info before deletion
    const demos = await executeQuery(
      'SELECT * FROM theme_demos WHERE theme_slug = ?',
      [slug]
    );
    
    if (demos.length === 0) {
      return res.status(404).json({ error: 'Theme demo not found' });
    }
    
    // Get wordpress-core container
    const container = getDocker().getContainer('shop_wordpress_core');
    
    // Helper function to execute WP-CLI commands in container
    const execWP = async (cmd) => {
      const execObj = await container.exec({
        Cmd: cmd,
        AttachStdout: true,
        AttachStderr: true,
        User: 'root'
      });
      
      const stream = await execObj.start({ hijack: true, stdin: false });
      
      return new Promise((resolve, reject) => {
        let output = '';
        let errorOutput = '';
        
        container.modem.demuxStream(stream, {
          write: (chunk) => {
            output += chunk.toString();
          }
        }, {
          write: (chunk) => {
            errorOutput += chunk.toString();
          }
        });
        
        stream.on('end', () => {
          resolve({ stdout: output, stderr: errorOutput });
        });
        
        stream.on('error', (err) => {
          reject(err);
        });
        
        setTimeout(() => {
          resolve({ stdout: output, stderr: errorOutput });
        }, 10000);
      });
    };
    
    // 1. Remove theme from WordPress (if installed)
    try {
      const wpThemePath = `${WP_ROOT}/wp-content/themes/${slug}`;
      const fs = require('fs').promises;
      
      // Check if theme directory exists in WordPress
      try {
        await fs.access(wpThemePath);
        console.log(`Removing theme from WordPress: ${wpThemePath}`);
        
        // Remove theme directory
        await fs.rm(wpThemePath, { recursive: true, force: true });
        console.log(`Theme ${slug} removed from WordPress`);
      } catch (accessErr) {
        if (accessErr.code !== 'ENOENT') {
          console.warn('Failed to check WordPress theme directory:', accessErr.message);
        }
      }
      
      // Also try to uninstall via WP-CLI (non-critical)
      try {
        await execWP(['wp', 'theme', 'delete', slug, '--path=/var/www/themes', '--allow-root']);
        console.log(`Theme ${slug} deleted via WP-CLI`);
      } catch (wpErr) {
        // Theme might not be installed, that's okay
        console.log(`WP-CLI delete skipped (theme may not exist): ${wpErr.message}`);
      }
    } catch (wpErr) {
      console.warn('WordPress removal error (non-critical):', wpErr.message);
    }
    
    // 2. Remove extracted theme files
    try {
      const { removeThemeDemo } = require('../services/themeExtractor');
      const removeResult = await removeThemeDemo(slug);
      if (!removeResult.success) {
        console.warn('Failed to remove theme demo files:', removeResult.error);
      } else {
        console.log(`Theme demo files removed: ${slug}`);
      }
    } catch (removeErr) {
      console.warn('Theme demo removal error (non-critical):', removeErr.message);
    }
    
    // 3. Delete from database
    await executeQuery('DELETE FROM theme_demos WHERE theme_slug = ?', [slug]);
    console.log(`Theme demo ${slug} deleted from database`);
    
    res.json({ success: true, message: 'Theme demo deleted successfully' });
  } catch (err) {
    console.error('Delete theme demo error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

module.exports = router;
