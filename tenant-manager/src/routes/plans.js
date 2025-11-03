const express = require('express');
const Joi = require('joi');
const { executeQuery } = require('../config/database');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateJWT);

const planSchema = Joi.object({
  name: Joi.string().max(255).required(),
  type: Joi.string().valid('normal', 'special').required(),
  duration: Joi.string().valid('monthly', 'quarterly', 'semiannual', 'yearly').required(),
  storage_gb: Joi.number().positive().required(),
  price: Joi.number().integer().min(0).required(),
  description: Joi.string().allow('').optional(),
  features: Joi.object().unknown(true).optional(),
  meters: Joi.number().positive().min(0).default(0),
  max_users: Joi.number().integer().min(0).default(0),
  max_domains: Joi.number().integer().min(1).default(1),
  is_active: Joi.boolean().default(true),
  sort_order: Joi.number().integer().default(0)
});

// Get all plans
router.get('/', async (req, res) => {
  try {
    const { type, duration, is_active } = req.query;
    let query = 'SELECT * FROM plans WHERE 1=1';
    const params = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (duration) {
      query += ' AND duration = ?';
      params.push(duration);
    }
    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY sort_order ASC, created_at DESC';

    const items = await executeQuery(query, params);
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('List plans error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get single plan
router.get('/:id', async (req, res) => {
  try {
    const rows = await executeQuery('SELECT * FROM plans WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Get plan error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create plan
router.post('/', async (req, res) => {
  try {
    const { error, value } = planSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });

    const featuresJson = value.features ? JSON.stringify(value.features) : null;

    const result = await executeQuery(
      `INSERT INTO plans (name, type, duration, storage_gb, price, description, features, meters, max_users, max_domains, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        value.name,
        value.type,
        value.duration,
        value.storage_gb,
        value.price,
        value.description || null,
        featuresJson,
        value.meters || 0,
        value.max_users || 0,
        value.max_domains || 1,
        value.is_active ? 1 : 0,
        value.sort_order || 0
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Create plan error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update plan
router.put('/:id', async (req, res) => {
  try {
    const { error, value } = planSchema.fork(Object.keys(planSchema.describe().keys), (f) => f.optional()).min(1).validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });

    const fields = [];
    const params = [];

    const updatable = ['name', 'type', 'duration', 'storage_gb', 'price', 'description', 'features', 'meters', 'max_users', 'max_domains', 'is_active', 'sort_order'];
    
    updatable.forEach((k) => {
      if (k in value) {
        if (k === 'features') {
          fields.push(`${k} = ?`);
          params.push(value[k] ? JSON.stringify(value[k]) : null);
        } else if (k === 'is_active') {
          fields.push(`${k} = ?`);
          params.push(value[k] ? 1 : 0);
        } else {
          fields.push(`${k} = ?`);
          params.push(value[k]);
        }
      }
    });

    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });

    params.push(req.params.id);
    await executeQuery(
      `UPDATE plans SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Update plan error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete plan
router.delete('/:id', async (req, res) => {
  try {
    // Check if plan is in use
    const tenants = await executeQuery('SELECT COUNT(*) as count FROM tenants WHERE plan_id = ?', [req.params.id]);
    if (tenants[0]?.count > 0) {
      return res.status(400).json({ error: 'Cannot delete plan that is in use by tenants' });
    }

    await executeQuery('DELETE FROM plans WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete plan error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

