-- Add foreign key and index for plan_id in tenants table
-- Note: This must run after 09_plans_table.sql

-- Add foreign key (only if not exists)
-- MySQL doesn't support IF NOT EXISTS for foreign keys, so we check first
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tenants' 
    AND CONSTRAINT_NAME = 'tenants_ibfk_plan_id'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE tenants ADD CONSTRAINT tenants_ibfk_plan_id FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index (only if not exists)
SET @idx_exists = (
    SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'tenants' 
    AND INDEX_NAME = 'idx_plan_id'
);

SET @sql = IF(@idx_exists = 0,
    'CREATE INDEX idx_plan_id ON tenants(plan_id)',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

