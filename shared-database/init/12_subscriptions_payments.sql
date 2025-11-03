-- Create subscriptions table for tenant plan renewals
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    plan_id INT NOT NULL,
    status ENUM('active', 'expired', 'cancelled', 'pending_renewal') DEFAULT 'active',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    grace_period_end TIMESTAMP NULL, -- 2 weeks after end_date
    auto_renew BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE RESTRICT,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_status (status),
    INDEX idx_end_date (end_date),
    INDEX idx_grace_period_end (grace_period_end)
);

-- Create payments table for plan payments
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subscription_id INT NULL,
    tenant_id INT NOT NULL,
    plan_id INT NOT NULL,
    amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'IRR',
    payment_method VARCHAR(50) DEFAULT 'manual',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255) NULL,
    payment_gateway VARCHAR(50) NULL,
    payment_date TIMESTAMP NULL,
    description TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE RESTRICT,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_subscription_id (subscription_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_payment_date (payment_date),
    INDEX idx_transaction_id (transaction_id)
);

-- Add grace_period_end and subscription tracking to tenants
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tenants' 
    AND COLUMN_NAME = 'current_subscription_id'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE tenants ADD COLUMN current_subscription_id INT NULL AFTER plan_id',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key for current_subscription_id
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tenants' 
    AND CONSTRAINT_NAME = 'tenants_ibfk_subscription'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE tenants ADD CONSTRAINT tenants_ibfk_subscription FOREIGN KEY (current_subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for current_subscription_id
SET @idx_exists = (
    SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tenants' 
    AND INDEX_NAME = 'idx_current_subscription_id'
);

SET @sql = IF(@idx_exists = 0,
    'CREATE INDEX idx_current_subscription_id ON tenants(current_subscription_id)',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

