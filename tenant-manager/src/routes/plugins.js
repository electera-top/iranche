const express = require('express');
const Joi = require('joi');
const { executeQuery } = require('../config/database');

const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');

router.use(authenticateJWT);

const pluginSchema = Joi.object({
  name: Joi.string().max(150).required(),
  slug: Joi.string().max(160).required(),
  version: Joi.string().max(50).default('1.0.0'),
  description: Joi.string().allow('').optional(),
  price: Joi.number().integer().min(0).default(0),
  is_free: Joi.boolean().default(true),
  status: Joi.string().valid('active', 'inactive').default('active'),
  author: Joi.string().max(150).allow('').optional(),
  category_id: Joi.number().integer().positive().allow(null).optional(),
  banner_file_id: Joi.number().integer().positive().allow(null).optional(),
  zip_file_id: Joi.number().integer().positive().allow(null).optional(),
  meta: Joi.object().unknown(true).optional()
});

router.post('/', async (req, res) => {
  try {
    const { error, value } = pluginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });
    const result = await executeQuery(
      `INSERT INTO plugins (name, slug, version, description, price, is_free, status, author, meta, category_id, banner_file_id, zip_file_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [value.name, value.slug, value.version, value.description || null, value.price || 0, value.is_free ? 1 : 0, value.status || 'active', value.author || null, value.meta ? JSON.stringify(value.meta) : null, value.category_id || null, value.banner_file_id || null, value.zip_file_id || null]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Create plugin error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await executeQuery(`
      SELECT p.*, pc.name as category_name
      FROM plugins p
      LEFT JOIN plugin_categories pc ON pc.id = p.category_id
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('List plugins error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM plugins WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Get plugin error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { error, value } = pluginSchema.min(1).validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });
    const fields = [];
    const params = [];
    const updatable = ['name','slug','version','description','price','is_free','status','author','meta','category_id','banner_file_id','zip_file_id'];
    updatable.forEach((k)=>{ if (k in value) { fields.push(`${k} = ?`); params.push(k==='meta'? JSON.stringify(value[k]) : k==='is_free' ? (value[k]?1:0) : value[k]); } });
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    await executeQuery(`UPDATE plugins SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ success: true });
  } catch (err) {
    console.error('Update plugin error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM plugins WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete plugin error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


