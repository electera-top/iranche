const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/database');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateJWT);

const createSchema = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  national_id: Joi.string().max(10).required(),
  phone: Joi.string().max(15).required(),
  username: Joi.string().max(50).required(),
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('super_admin','admin','moderator').default('admin'),
  is_active: Joi.boolean().default(true)
});

// List staff (admins)
router.get('/', async (req, res) => {
  try {
    const rows = await executeQuery(`
      SELECT a.id, a.user_id, a.username, a.email, a.is_active, a.role, a.last_login,
             u.first_name, u.last_name, u.national_id, u.phone, u.created_at
      FROM admins a
      JOIN users u ON u.id = a.user_id
      ORDER BY a.id DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('List staff error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create staff
router.post('/', async (req, res) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });

    // Ensure unique username/email
    const dup = await executeQuery('SELECT 1 FROM admins WHERE username = ? OR email = ?', [value.username, value.email]);
    if (dup.length) return res.status(409).json({ error: 'Conflict', message: 'Username or email already exists' });

    // Ensure user exists or create
    let userRows = await executeQuery('SELECT id FROM users WHERE national_id = ? OR phone = ? LIMIT 1', [value.national_id, value.phone]);
    let userId;
    if (userRows.length) {
      userId = userRows[0].id;
      await executeQuery('UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?', [value.first_name, value.last_name, value.phone, userId]);
    } else {
      const u = await executeQuery('INSERT INTO users (first_name, last_name, national_id, phone) VALUES (?, ?, ?, ?)', [value.first_name, value.last_name, value.national_id, value.phone]);
      userId = u.insertId;
    }

    // Hash password
    const hashed = await bcrypt.hash(value.password, 10);

    // Create admin
    const a = await executeQuery('INSERT INTO admins (user_id, username, password, email, is_active, role) VALUES (?, ?, ?, ?, ?, ?)', [userId, value.username, hashed, value.email, value.is_active ? 1 : 0, value.role]);

    res.json({ success: true, id: a.insertId, user_id: userId });
  } catch (err) {
    console.error('Create staff error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update staff
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Bad Request' });

    const schema = Joi.object({
      first_name: Joi.string().max(100),
      last_name: Joi.string().max(100),
      national_id: Joi.string().max(10),
      phone: Joi.string().max(15),
      username: Joi.string().max(50),
      email: Joi.string().email().max(255),
      password: Joi.string().min(6).max(128),
      role: Joi.string().valid('super_admin','admin','moderator'),
      is_active: Joi.boolean()
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });

    // Update admin
    const adminFields = [];
    const adminParams = [];
    const adminMap = { username:'username', email:'email', role:'role', is_active:'is_active' };
    Object.keys(adminMap).forEach(k => {
      if (k in value) { adminFields.push(`${adminMap[k]} = ?`); adminParams.push(k === 'is_active' ? (value[k]?1:0) : value[k]); }
    });
    if (value.password) {
      const hashed = await bcrypt.hash(value.password, 10);
      adminFields.push('password = ?');
      adminParams.push(hashed);
    }
    if (adminFields.length) {
      adminParams.push(id);
      await executeQuery(`UPDATE admins SET ${adminFields.join(', ')} WHERE id = ?`, adminParams);
    }

    // Update linked user (if provided)
    const userFields = [];
    const userParams = [];
    const userMap = { first_name:'first_name', last_name:'last_name', national_id:'national_id', phone:'phone' };
    Object.keys(userMap).forEach(k => { if (k in value) { userFields.push(`${userMap[k]} = ?`); userParams.push(value[k]); } });
    if (userFields.length) {
      const r = await executeQuery('SELECT user_id FROM admins WHERE id = ?', [id]);
      if (r.length) {
        userParams.push(r[0].user_id);
        await executeQuery(`UPDATE users SET ${userFields.join(', ')} WHERE id = ?`, userParams);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Update staff error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete staff (admin row)
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Bad Request' });
    await executeQuery('DELETE FROM admins WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete staff error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


