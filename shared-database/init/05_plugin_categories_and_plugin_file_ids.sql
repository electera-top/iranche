USE shop_management;

-- Plugin categories table
CREATE TABLE IF NOT EXISTS plugin_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES plugin_categories(id) ON DELETE SET NULL,
  INDEX idx_parent_id (parent_id),
  INDEX idx_name (name)
);

-- Ensure plugins has file id columns and category reference
ALTER TABLE plugins ADD COLUMN IF NOT EXISTS banner_file_id INT NULL;
ALTER TABLE plugins ADD COLUMN IF NOT EXISTS zip_file_id INT NULL;
ALTER TABLE plugins ADD COLUMN IF NOT EXISTS category_id INT NULL;

-- Optional indexes
CREATE INDEX IF NOT EXISTS idx_plugin_banner_file_id ON plugins (banner_file_id);
CREATE INDEX IF NOT EXISTS idx_plugin_zip_file_id ON plugins (zip_file_id);
CREATE INDEX IF NOT EXISTS idx_plugin_category_id ON plugins (category_id);

-- Drop legacy banner_url if present on plugins
ALTER TABLE plugins DROP COLUMN IF EXISTS banner_url;

-- Add FK to plugin_categories
ALTER TABLE plugins 
  ADD CONSTRAINT IF NOT EXISTS fk_plugins_category 
  FOREIGN KEY (category_id) REFERENCES plugin_categories(id) ON DELETE SET NULL;


