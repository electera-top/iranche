const express = require('express');
const Joi = require('joi');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Renew subscription (payment and activation)
router.post('/renew', async (req, res) => {
  try {
    const { tenant_id, plan_id, payment_method = 'manual' } = req.body;

    // Validate input
    if (!tenant_id || !plan_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'tenant_id and plan_id are required'
      });
    }

    // Get tenant info
    const tenants = await executeQuery(
      'SELECT * FROM tenants WHERE id = ?',
      [tenant_id]
    );

    if (tenants.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tenant not found',
        message: 'فروشگاه یافت نشد'
      });
    }

    const tenant = tenants[0];

    // Get plan info
    const plans = await executeQuery(
      'SELECT * FROM plans WHERE id = ? AND is_active = 1',
      [plan_id]
    );

    if (plans.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found',
        message: 'پلن یافت نشد یا غیرفعال است'
      });
    }

    const plan = plans[0];

    // Calculate subscription dates
    const now = new Date();
    const duration_months = {
      'monthly': 1,
      'quarterly': 3,
      'semiannual': 6,
      'yearly': 12
    };
    const months = duration_months[plan.duration] || 1;
    
    // Calculate end date (add months to now)
    const end_date = new Date(now);
    end_date.setMonth(end_date.getMonth() + months);
    
    // Grace period: 2 weeks after end_date
    const grace_period_end = new Date(end_date);
    grace_period_end.setDate(grace_period_end.getDate() + 14);

    try {
      // Create or update subscription
      let subscription_id = tenant.current_subscription_id;
      
      if (subscription_id) {
        // Update existing subscription
        await executeQuery(
          `UPDATE subscriptions 
           SET plan_id = ?, status = 'active', start_date = ?, end_date = ?, 
               grace_period_end = ?, updated_at = NOW()
           WHERE id = ? AND tenant_id = ?`,
          [plan_id, now, end_date, grace_period_end, subscription_id, tenant_id]
        );
      } else {
        // Create new subscription
        const insertResult = await executeQuery(
          `INSERT INTO subscriptions 
           (tenant_id, plan_id, status, start_date, end_date, grace_period_end, auto_renew)
           VALUES (?, ?, 'active', ?, ?, ?, FALSE)`,
          [tenant_id, plan_id, now, end_date, grace_period_end]
        );
        subscription_id = insertResult.insertId;
      }

      // Create payment record
      await executeQuery(
        `INSERT INTO payments 
         (subscription_id, tenant_id, plan_id, amount, currency, payment_method, payment_status, payment_date)
         VALUES (?, ?, ?, ?, 'IRR', ?, 'completed', NOW())`,
        [subscription_id, tenant_id, plan_id, plan.price, payment_method]
      );

      // Update tenant
      await executeQuery(
        `UPDATE tenants 
         SET plan_id = ?, current_subscription_id = ?, status = 'active', 
             expires_at = ?, updated_at = NOW()
         WHERE id = ?`,
        [plan_id, subscription_id, end_date, tenant_id]
      );

      res.json({
        success: true,
        message: 'پرداخت با موفقیت ثبت شد و پلن فعال شد',
        data: {
          subscription_id,
          plan_id,
          end_date: end_date.toISOString(),
          grace_period_end: grace_period_end.toISOString()
        }
      });

    } catch (error) {
      throw error;
    }

  } catch (error) {
    console.error('Renew subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'خطا در پردازش پرداخت'
    });
  }
});

module.exports = router;

