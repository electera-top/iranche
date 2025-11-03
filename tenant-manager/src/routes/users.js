const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Validation schemas
const createUserSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).required(),
  last_name: Joi.string().min(2).max(100).required(),
  national_id: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  phone: Joi.string().pattern(/^09[0-9]{9}$/).required(),
  birth_date: Joi.date().optional(),
  wallet_rial: Joi.number().min(0).default(0),
  wallet_gold: Joi.number().min(0).default(0),
  wallet_income: Joi.number().min(0).default(0),
  is_admin: Joi.boolean().default(false),
  username: Joi.string().min(3).max(50).when('is_admin', { is: true, then: Joi.required() }),
  email: Joi.string().email().when('is_admin', { is: true, then: Joi.required() }),
  password: Joi.string().min(6).when('is_admin', { is: true, then: Joi.required() }),
  role: Joi.string().valid('super_admin', 'admin', 'moderator').when('is_admin', { is: true, then: Joi.required() })
});

const updateUserSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).required(),
  last_name: Joi.string().min(2).max(100).required(),
  national_id: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  phone: Joi.string().pattern(/^09[0-9]{9}$/).required(),
  birth_date: Joi.date().optional(),
  wallet_rial: Joi.number().min(0).default(0),
  wallet_gold: Joi.number().min(0).default(0),
  wallet_income: Joi.number().min(0).default(0)
});

// Get all users with filtering
router.get('/', async (req, res) => {
  try {
    const { search, user_type, page = 1, limit = 20 } = req.query;
    
    let whereClause = '';
    let params = [];
    
    if (search) {
      whereClause += ' WHERE (u.first_name LIKE ? OR u.last_name LIKE ? OR u.national_id LIKE ? OR u.phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    if (user_type === 'admin') {
      const clause = whereClause ? ' AND a.id IS NOT NULL' : ' WHERE a.id IS NOT NULL';
      whereClause += clause;
    } else if (user_type === 'user') {
      const clause = whereClause ? ' AND a.id IS NULL' : ' WHERE a.id IS NULL';
      whereClause += clause;
    }

    // Get total count
    const countResult = await executeQuery(
      `SELECT COUNT(*) as total FROM users u LEFT JOIN admins a ON u.id = a.user_id${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get users with pagination
    const offset = (page - 1) * limit;
    const users = await executeQuery(`
      SELECT 
        u.id, u.first_name, u.last_name, u.national_id, u.phone,
        u.profile_image, u.wallet_rial, u.wallet_gold, u.wallet_income,
        u.birth_date, u.created_at,
        a.id as admin_id, a.username, a.email, a.role, a.last_login,
        CASE WHEN a.id IS NOT NULL THEN 1 ELSE 0 END as is_admin
      FROM users u
      LEFT JOIN admins a ON u.id = a.user_id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `, params);

    // Format data
    const formattedUsers = users.map(user => ({
      ...user,
      created_at_formatted: new Date(user.created_at).toLocaleDateString('fa-IR'),
      wallet_rial_formatted: formatNumber(user.wallet_rial),
      wallet_gold_formatted: user.wallet_gold,
      wallet_income_formatted: formatNumber(user.wallet_income)
    }));

    res.json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch users'
    });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      });
    }

    const users = await executeQuery(`
      SELECT 
        u.id, u.first_name, u.last_name, u.national_id, u.phone,
        u.profile_image, u.wallet_rial, u.wallet_gold, u.wallet_income,
        u.birth_date, u.created_at,
        a.id as admin_id, a.username, a.email, a.role, a.last_login,
        CASE WHEN a.id IS NOT NULL THEN 1 ELSE 0 END as is_admin
      FROM users u
      LEFT JOIN admins a ON u.id = a.user_id
      WHERE u.id = ?
    `, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user'
    });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const {
      first_name, last_name, national_id, phone, birth_date,
      wallet_rial, wallet_gold, wallet_income, is_admin,
      username, email, password, role
    } = value;

    // Check if national_id already exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE national_id = ?',
      [national_id]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        error: 'Duplicate Entry',
        message: 'User with this national ID already exists'
      });
    }

    // Check if phone already exists
    const existingPhone = await executeQuery(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    );

    if (existingPhone.length > 0) {
      return res.status(400).json({
        error: 'Duplicate Entry',
        message: 'User with this phone number already exists'
      });
    }

    // Create user
    const userResult = await executeQuery(`
      INSERT INTO users 
      (first_name, last_name, national_id, phone, birth_date, wallet_rial, wallet_gold, wallet_income)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      first_name, last_name, national_id, phone, birth_date,
      wallet_rial, wallet_gold, wallet_income
    ]);

    const userId = userResult.insertId;

    // Create admin record if needed
    if (is_admin) {
      // Check if username already exists
      const existingUsername = await executeQuery(
        'SELECT id FROM admins WHERE username = ?',
        [username]
      );

      if (existingUsername.length > 0) {
        // Delete the user we just created
        await executeQuery('DELETE FROM users WHERE id = ?', [userId]);
        return res.status(400).json({
          error: 'Duplicate Entry',
          message: 'Username already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      await executeQuery(`
        INSERT INTO admins 
        (user_id, username, password, email, role)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, username, hashedPassword, email, role]);
    }

    res.json({
      success: true,
      message: 'User created successfully',
      data: {
        id: userId,
        first_name,
        last_name,
        national_id,
        phone,
        is_admin
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create user'
    });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      });
    }

    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const {
      first_name, last_name, national_id, phone, birth_date,
      wallet_rial, wallet_gold, wallet_income
    } = value;

    // Check if user exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    // Check if national_id is taken by another user
    const duplicateNationalId = await executeQuery(
      'SELECT id FROM users WHERE national_id = ? AND id != ?',
      [national_id, userId]
    );

    if (duplicateNationalId.length > 0) {
      return res.status(400).json({
        error: 'Duplicate Entry',
        message: 'National ID already exists for another user'
      });
    }

    // Check if phone is taken by another user
    const duplicatePhone = await executeQuery(
      'SELECT id FROM users WHERE phone = ? AND id != ?',
      [phone, userId]
    );

    if (duplicatePhone.length > 0) {
      return res.status(400).json({
        error: 'Duplicate Entry',
        message: 'Phone number already exists for another user'
      });
    }

    // Update user
    await executeQuery(`
      UPDATE users SET 
        first_name = ?, last_name = ?, national_id = ?, phone = ?,
        birth_date = ?, wallet_rial = ?, wallet_gold = ?, wallet_income = ?
      WHERE id = ?
    `, [
      first_name, last_name, national_id, phone, birth_date,
      wallet_rial, wallet_gold, wallet_income, userId
    ]);

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update user'
    });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      });
    }

    // Check if user exists
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    // Delete user (cascade will handle admin record)
    await executeQuery('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete user'
    });
  }
});

// Helper functions
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num);
}

module.exports = router;

