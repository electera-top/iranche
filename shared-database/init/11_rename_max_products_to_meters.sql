-- Rename max_products column to meters in plans table
-- This migration changes max_products to meters and converts existing values

-- Step 1: Add new column meters (only if it doesn't exist)
-- Check if meters column exists
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'plans' 
    AND COLUMN_NAME = 'meters'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE plans ADD COLUMN meters DECIMAL(10,2) DEFAULT 0.00 AFTER max_products',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Migrate existing data (convert max_products / 10 to meters)
-- Only update if meters is 0 or NULL and max_products exists
UPDATE plans SET meters = CASE 
    WHEN max_products > 0 THEN max_products / 10.0
    ELSE 0.00
END WHERE (meters IS NULL OR meters = 0) AND EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'plans' AND COLUMN_NAME = 'max_products');

-- Step 3: Drop old column (only if it exists)
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'plans' 
    AND COLUMN_NAME = 'max_products'
);

SET @sql = IF(@col_exists > 0,
    'ALTER TABLE plans DROP COLUMN max_products',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

