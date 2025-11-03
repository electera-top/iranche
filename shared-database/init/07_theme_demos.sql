CREATE TABLE IF NOT EXISTS theme_demos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  theme_slug VARCHAR(160) NOT NULL,
  demo_path VARCHAR(255) NOT NULL,
  demo_url VARCHAR(500) NOT NULL,
  wp_site_id INT NULL,
  status ENUM('active','inactive','building','error') DEFAULT 'inactive',
  snapshot_ref VARCHAR(255) NULL,
  notes VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_theme_slug (theme_slug),
  INDEX idx_status (status)
)


