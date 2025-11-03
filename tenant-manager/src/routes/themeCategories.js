const express = require('express');
const Joi = require('joi');
const { executeQuery } = require('../config/database');

const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');

router.use(authenticateJWT);

const schema = Joi.object({
  name: Joi.string().max(150).required(),
  slug: Joi.string().max(160).required(),
  parent_id: Joi.number().integer().allow(null).optional(),
  description: Joi.string().max(500).allow('').optional()
});

router.post('/', async (req, res) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });
    const result = await executeQuery(
      'INSERT INTO theme_categories (name, slug, parent_id, description) VALUES (?, ?, ?, ?)',
      [value.name, value.slug, value.parent_id || null, value.description || null]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Create theme category error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await executeQuery(
      'SELECT c.*, p.name AS parent_name FROM theme_categories c LEFT JOIN theme_categories p ON p.id = c.parent_id ORDER BY c.created_at DESC'
    );
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('List theme categories error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { error, value } = schema.min(1).validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });
    const fields = [];
    const params = [];
    ['name','slug','parent_id','description'].forEach((k)=>{ if (k in value) { fields.push(`${k} = ?`); params.push(value[k]); }});
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    await executeQuery(`UPDATE theme_categories SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ success: true });
  } catch (err) {
    console.error('Update theme category error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await executeQuery('DELETE FROM theme_categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete theme category error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


