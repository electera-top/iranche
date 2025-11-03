const express = require('express');
const Joi = require('joi');
const { executeQuery } = require('../config/database');

const router = express.Router();

const { authenticateJWT } = require('../middleware/auth');

router.use(authenticateJWT);

// Lazy load themeExtractor to avoid errors if package is missing
let themeExtractor = null;
function getThemeExtractor() {
  if (!themeExtractor) {
    try {
      themeExtractor = require('../services/themeExtractor');
    } catch (err) {
      console.error('Theme extractor not available:', err.message);
      return null;
    }
  }
  return themeExtractor;
}

const themeSchema = Joi.object({
  name: Joi.string().max(150).required(),
  slug: Joi.string().max(160).required(),
  version: Joi.string().max(50).default('1.0.0'),
  description: Joi.string().allow('').optional(),
  banner_file_id: Joi.number().integer().allow(null).optional(),
  zip_file_id: Joi.number().integer().allow(null).optional(),
  price: Joi.number().integer().min(0).default(0),
  is_free: Joi.boolean().default(true),
  status: Joi.string().valid('active', 'inactive').default('active'),
  author: Joi.string().max(150).allow('').optional(),
  category_id: Joi.number().integer().allow(null).optional(),
  meta: Joi.object().unknown(true).optional()
});

function buildDemoBase() {
  const base = process.env.THEME_DEMO_BASE || 'http://themes.localhost';
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

// Create theme
router.post('/', async (req, res) => {
  try {
    const { error, value } = themeSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });

    const metaJson = value.meta ? JSON.stringify(value.meta) : null;
    const result = await executeQuery(
      `INSERT INTO themes (name, category_id, slug, version, description, banner_file_id, zip_file_id, price, is_free, status, author, meta)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [value.name, value.category_id || null, value.slug, value.version, value.description || null, value.banner_file_id || null, value.zip_file_id || null, value.price || 0, value.is_free ? 1 : 0, value.status || 'active', value.author || null, metaJson]
    );

    // Auto upsert demo record (dynamic, no code change needed later)
    try {
      const demoBase = buildDemoBase();
      const demoUrl = `${demoBase}/${value.slug}`;
      await executeQuery(
        `INSERT INTO theme_demos (theme_slug, demo_path, demo_url, status)
         VALUES (?, ?, ?, 'building')
         ON DUPLICATE KEY UPDATE demo_path = VALUES(demo_path), demo_url = VALUES(demo_url), status = 'building', updated_at = CURRENT_TIMESTAMP`,
        [value.slug, `/${value.slug}`, demoUrl]
      );
    } catch (e) {
      console.warn('Auto demo upsert failed (non-critical):', e.message);
    }

    // Extract zip file if provided
    if (value.zip_file_id) {
      try {
        const extractor = getThemeExtractor();
        if (extractor && extractor.extractThemeZip) {
          const extractResult = await extractor.extractThemeZip(value.zip_file_id, value.slug);
          if (!extractResult.success) {
            console.warn('Theme extraction failed:', extractResult.error);
            // Update status to error
            await executeQuery(
              `UPDATE theme_demos SET status = 'error', notes = ? WHERE theme_slug = ?`,
              [extractResult.error, value.slug]
            );
          }
        } else {
          console.warn('Theme extractor not available, skipping extraction');
        }
      } catch (e) {
        console.warn('Theme extraction error (non-critical):', e.message);
      }
    }

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Create theme error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// List themes
router.get('/', async (req, res) => {
  try {
    const items = await executeQuery(`
      SELECT t.*, c.name AS category_name, d.demo_url, d.status AS demo_status
      FROM themes t
      LEFT JOIN theme_categories c ON c.id = t.category_id
      LEFT JOIN theme_demos d ON d.theme_slug = t.slug
      ORDER BY t.created_at DESC
    `);
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('List themes error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get one theme
router.get('/:id', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM themes WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Get theme error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update theme
router.put('/:id', async (req, res) => {
  try {
    const { error, value } = themeSchema.min(1).validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });

    const fields = [];
    const params = [];
    const updatable = ['name','slug','version','description','banner_file_id','zip_file_id','price','is_free','status','author','category_id','meta'];
    updatable.forEach((k) => {
      if (k in value) {
        fields.push(`${k} = ?`);
        params.push(k === 'meta' ? JSON.stringify(value[k]) : k === 'is_free' ? (value[k] ? 1 : 0) : value[k]);
      }
    });
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    await executeQuery(`UPDATE themes SET ${fields.join(', ')} WHERE id = ?`, params);

    // Get current theme slug for path update
    const currentTheme = await executeQuery('SELECT slug FROM themes WHERE id = ?', [req.params.id]);
    const currentSlug = currentTheme[0]?.slug;
    const newSlug = value.slug || currentSlug;

    // If slug changed, rename demo directory and update demo record
    if ('slug' in value && value.slug !== currentSlug) {
      try {
        const extractor = getThemeExtractor();
        if (extractor && extractor.removeThemeDemo) {
          await extractor.removeThemeDemo(currentSlug); // Remove old directory
          await extractor.removeThemeDemo(value.slug); // Clean up new directory if exists
        }
      } catch (e) {
        console.warn('Failed to rename demo directory:', e.message);
      }
    }

    // If slug changed or present, keep demo mapping in sync
    try {
      if ('slug' in value || 'zip_file_id' in value) {
        const demoBase = buildDemoBase();
        const demoUrl = `${demoBase}/${newSlug}`;
        await executeQuery(
          `INSERT INTO theme_demos (theme_slug, demo_path, demo_url, status)
           VALUES (?, ?, ?, 'building')
           ON DUPLICATE KEY UPDATE demo_path = VALUES(demo_path), demo_url = VALUES(demo_url), status = 'building', updated_at = CURRENT_TIMESTAMP`,
          [newSlug, `/${newSlug}`, demoUrl]
        );
      }
    } catch (e) {
      console.warn('Auto demo sync failed (non-critical):', e.message);
    }

    // Extract zip file if provided or if slug changed
    if (value.zip_file_id || ('slug' in value && value.slug !== currentSlug)) {
      try {
        const extractor = getThemeExtractor();
        if (extractor && extractor.extractThemeZip) {
          const finalSlug = value.slug || currentSlug;
          const zipFileId = value.zip_file_id || (await executeQuery('SELECT zip_file_id FROM themes WHERE id = ?', [req.params.id]))[0]?.zip_file_id;
          
          if (zipFileId) {
            const extractResult = await extractor.extractThemeZip(zipFileId, finalSlug);
            if (!extractResult.success) {
              console.warn('Theme extraction failed:', extractResult.error);
              await executeQuery(
                `UPDATE theme_demos SET status = 'error', notes = ? WHERE theme_slug = ?`,
                [extractResult.error, finalSlug]
              );
            }
          }
        } else {
          console.warn('Theme extractor not available, skipping extraction');
        }
      } catch (e) {
        console.warn('Theme extraction error (non-critical):', e.message);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Update theme error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Trigger theme extraction manually
router.post('/:id/extract', async (req, res) => {
  try {
    const extractor = getThemeExtractor();
    if (!extractor || !extractor.extractThemeZip) {
      return res.status(503).json({ error: 'Theme extractor not available', message: 'adm-zip package is not installed' });
    }

    const theme = await executeQuery('SELECT slug, zip_file_id FROM themes WHERE id = ?', [req.params.id]);
    if (!theme || theme.length === 0) {
      return res.status(404).json({ error: 'Theme not found' });
    }

    const themeData = theme[0];
    if (!themeData.zip_file_id) {
      return res.status(400).json({ error: 'No zip file attached to this theme' });
    }

    // Update status to building
    await executeQuery(
      `UPDATE theme_demos SET status = 'building', updated_at = CURRENT_TIMESTAMP WHERE theme_slug = ?`,
      [themeData.slug]
    );

    // Extract zip file
    const extractResult = await extractor.extractThemeZip(themeData.zip_file_id, themeData.slug);
    
    if (!extractResult.success) {
      await executeQuery(
        `UPDATE theme_demos SET status = 'error', notes = ? WHERE theme_slug = ?`,
        [extractResult.error, themeData.slug]
      );
      return res.status(500).json({ error: 'Extraction failed', details: extractResult.error });
    }

    res.json({ success: true, message: 'Theme extracted successfully', path: extractResult.path });
  } catch (err) {
    console.error('Theme extraction error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete theme
router.delete('/:id', async (req, res) => {
  try {
    // Get theme slug before deletion
    const theme = await executeQuery('SELECT slug FROM themes WHERE id = ?', [req.params.id]);
    const themeSlug = theme[0]?.slug;

    // Delete from database
    await executeQuery('DELETE FROM themes WHERE id = ?', [req.params.id]);

    // Remove demo directory
    if (themeSlug) {
      try {
        const extractor = getThemeExtractor();
        if (extractor && extractor.removeThemeDemo) {
          await extractor.removeThemeDemo(themeSlug);
        }
      } catch (e) {
        console.warn('Failed to remove theme demo directory:', e.message);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Delete theme error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


