const express = require('express');
const { executeQuery } = require('../../config/database');

const router = express.Router();

function buildDemoBase() {
  const base = process.env.THEME_DEMO_BASE || 'http://themes.localhost';
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

// Front request: public, unauthenticated list of free & active themes
router.get('/', async (req, res) => {
  try {
    const items = await executeQuery(`
      SELECT t.id, t.name, t.slug, t.version, t.description, t.price, t.is_free, t.status, t.author, t.banner_file_id, d.demo_url
      FROM themes t
      LEFT JOIN theme_demos d ON d.theme_slug = t.slug
      WHERE (t.status = 'active' OR t.status IS NULL)
        AND (t.is_free = 1 OR t.price = 0)
      ORDER BY t.created_at DESC
    `);
    const demoBase = buildDemoBase();
    const withUrls = items.map((t) => ({ ...t, demo_url: t.demo_url || `${demoBase}/${t.slug}` }));
    res.json({ success: true, data: withUrls });
  } catch (err) {
    console.error('FrontReq themes error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


