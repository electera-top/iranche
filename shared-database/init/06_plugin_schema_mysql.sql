-- MySQL-compatible plugin schema migration (no USE, no IF NOT EXISTS)

CREATE TABLE plugin_categories (
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

ALTER TABLE plugins ADD COLUMN banner_file_id INT NULL;
ALTER TABLE plugins ADD COLUMN zip_file_id INT NULL;
ALTER TABLE plugins ADD COLUMN category_id INT NULL;

CREATE INDEX idx_plugin_banner_file_id ON plugins (banner_file_id);
CREATE INDEX idx_plugin_zip_file_id ON plugins (zip_file_id);
CREATE INDEX idx_plugin_category_id ON plugins (category_id);

ALTER TABLE plugins DROP COLUMN banner_url;

ALTER TABLE plugins 
  ADD CONSTRAINT fk_plugins_category 
  FOREIGN KEY (category_id) REFERENCES plugin_categories(id) ON DELETE SET NULL;


