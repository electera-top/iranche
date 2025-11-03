-- Create plans table for shop plans
CREATE TABLE IF NOT EXISTS plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('normal', 'special') DEFAULT 'normal',
    duration ENUM('monthly', 'quarterly', 'semiannual', 'yearly') DEFAULT 'monthly',
    storage_gb DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    price BIGINT NOT NULL DEFAULT 0,
    description TEXT,
    features JSON,
    meters DECIMAL(10,2) DEFAULT 0.00,
    max_users INT DEFAULT 0,
    max_domains INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_duration (duration),
    INDEX idx_is_active (is_active),
    INDEX idx_sort_order (sort_order)
);

-- Add plan_id to tenants table if not exists
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tenants' 
    AND COLUMN_NAME = 'plan_id'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE tenants ADD COLUMN plan_id INT NULL AFTER plan_type',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Insert default plans (only if table is empty)
INSERT IGNORE INTO plans (name, type, duration, storage_gb, price, description, features, meters, max_users, max_domains, is_active, sort_order) VALUES
('پلن رایگان', 'normal', 'monthly', 1.00, 0, 'پلن پایه رایگان برای شروع', '{"support": "community", "themes": 1, "plugins": 3}', 5.00, 1, 1, 1, 1),
('پلن معمولی ماهانه', 'normal', 'monthly', 5.00, 50000, 'پلن معمولی ماهانه با حجم 5 گیگابایت', '{"support": "email", "themes": 5, "plugins": 10}', 50.00, 3, 1, 1, 2),
('پلن معمولی سه‌ماهه', 'normal', 'quarterly', 5.00, 135000, 'پلن معمولی سه‌ماهه با تخفیف 10 درصد', '{"support": "email", "themes": 5, "plugins": 10}', 50.00, 3, 1, 1, 3),
('پلن معمولی شش‌ماهه', 'normal', 'semiannual', 5.00, 240000, 'پلن معمولی شش‌ماهه با تخفیف 20 درصد', '{"support": "email", "themes": 5, "plugins": 10}', 50.00, 3, 1, 1, 4),
('پلن معمولی سالانه', 'normal', 'yearly', 5.00, 420000, 'پلن معمولی سالانه با تخفیف 30 درصد', '{"support": "email", "themes": 5, "plugins": 10}', 50.00, 3, 1, 1, 5),
('پلن ویژه ماهانه', 'special', 'monthly', 20.00, 150000, 'پلن ویژه ماهانه با حجم 20 گیگابایت', '{"support": "priority", "themes": "unlimited", "plugins": "unlimited"}', 500.00, 10, 3, 1, 6),
('پلن ویژه سه‌ماهه', 'special', 'quarterly', 20.00, 405000, 'پلن ویژه سه‌ماهه با تخفیف 10 درصد', '{"support": "priority", "themes": "unlimited", "plugins": "unlimited"}', 500.00, 10, 3, 1, 7),
('پلن ویژه شش‌ماهه', 'special', 'semiannual', 20.00, 720000, 'پلن ویژه شش‌ماهه با تخفیف 20 درصد', '{"support": "priority", "themes": "unlimited", "plugins": "unlimited"}', 500.00, 10, 3, 1, 8),
('پلن ویژه سالانه', 'special', 'yearly', 20.00, 1260000, 'پلن ویژه سالانه با تخفیف 30 درصد', '{"support": "priority", "themes": "unlimited", "plugins": "unlimited"}', 500.00, 10, 3, 1, 9);

