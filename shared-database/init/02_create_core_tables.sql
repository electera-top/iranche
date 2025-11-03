USE shop_management;

CREATE TABLE IF NOT EXISTS themes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  version VARCHAR(50) DEFAULT '1.0.0',
  description TEXT,
  banner_file_id INT NULL,
  zip_file_id INT NULL,
  price BIGINT DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  status ENUM('active','inactive') DEFAULT 'active',
  author VARCHAR(150),
  meta JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_price (price)
);

CREATE TABLE IF NOT EXISTS plugins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  version VARCHAR(50) DEFAULT '1.0.0',
  description TEXT,
  banner_url VARCHAR(500),
  price BIGINT DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  status ENUM('active','inactive') DEFAULT 'active',
  author VARCHAR(150),
  meta JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_price (price)
);


