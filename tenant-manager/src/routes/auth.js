const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Validation Error', details: error.message });

    const rows = await executeQuery('SELECT * FROM admins WHERE username = ? AND is_active = 1', [value.username]);
    if (!rows.length) return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    const admin = rows[0];

    let ok = false;
    if (admin.password && admin.password.startsWith('$2')) {
      ok = await bcrypt.compare(value.password, admin.password);
    } else {
      ok = value.password === admin.password;
    }
    if (!ok) return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, user_id: admin.user_id, username: admin.username, role: admin.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    res.json({ success: true, token, admin: { id: admin.id, username: admin.username, role: admin.role, email: admin.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const rows = await executeQuery('SELECT id, user_id, username, email, role, is_active FROM admins WHERE id = ?', [req.admin.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json({ success: true, admin: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


