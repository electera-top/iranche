-- Initialize shop_management database
CREATE DATABASE IF NOT EXISTS shop_management;
USE shop_management;

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subdomain VARCHAR(63) UNIQUE NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    shop_description TEXT,
    owner_name VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255) UNIQUE NOT NULL,
    owner_phone VARCHAR(20),
    plan_type ENUM('free', 'basic', 'premium', 'enterprise') DEFAULT 'free',
    theme VARCHAR(100) DEFAULT 'default',
    plugins JSON,
    status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'pending',
    database_name VARCHAR(100),
    database_user VARCHAR(100),
    database_password VARCHAR(255),
    admin_username VARCHAR(50),
    admin_password VARCHAR(255),
    admin_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_subdomain (subdomain),
    INDEX idx_owner_email (owner_email),
    INDEX idx_status (status)
);

-- Create tenant_domains table
CREATE TABLE IF NOT EXISTS tenant_domains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    domain VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    ssl_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_domain (domain)
);

-- Create tenant_stats table
CREATE TABLE IF NOT EXISTS tenant_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    total_products INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    total_customers INT DEFAULT 0,
    last_sync_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Create global_products table
CREATE TABLE IF NOT EXISTS global_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    original_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),
    image_url TEXT,
    stock_quantity INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tenant_product (tenant_id, original_id),
    INDEX idx_category (category),
    INDEX idx_brand (brand),
    INDEX idx_price (price),
    INDEX idx_rating (rating)
);

-- Create global_articles table
CREATE TABLE IF NOT EXISTS global_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    original_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author VARCHAR(100),
    category VARCHAR(100),
    tags JSON,
    featured_image TEXT,
    slug VARCHAR(255) UNIQUE,
    status ENUM('published', 'draft', 'private') DEFAULT 'published',
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tenant_article (tenant_id, original_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_slug (slug)
);

-- Create global_brands table
CREATE TABLE IF NOT EXISTS global_brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    original_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tenant_brand (tenant_id, original_id),
    INDEX idx_name (name)
);

-- Create global_ratings table
CREATE TABLE IF NOT EXISTS global_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    product_id INT NOT NULL,
    customer_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES global_products(id) ON DELETE CASCADE,
    INDEX idx_product_rating (product_id, rating)
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('main_domain', 'localhost', 'Main domain for the system'),
('default_theme', 'twentytwentyfour', 'Default WordPress theme for new tenants'),
('default_plugins', '["woocommerce","yoast-seo","contact-form-7"]', 'Default plugins for new tenants'),
('max_products_per_tenant', '1000', 'Maximum number of products per tenant'),
('max_storage_per_tenant', '1073741824', 'Maximum storage per tenant in bytes (1GB)'),
('ssl_enabled', 'true', 'Enable SSL for tenant domains'),
('auto_backup_enabled', 'true', 'Enable automatic backups'),
('backup_retention_days', '30', 'Number of days to retain backups'),
('sync_interval_minutes', '60', 'Interval for syncing tenant data in minutes'),
('rate_limit_per_minute', '100', 'API rate limit per minute per tenant')
ON DUPLICATE KEY UPDATE
    setting_value = VALUES(setting_value),
    updated_at = CURRENT_TIMESTAMP;

-- Create indexes for better performance
CREATE INDEX idx_tenants_created_at ON tenants(created_at);
CREATE INDEX idx_global_products_created_at ON global_products(created_at);
CREATE INDEX idx_global_articles_created_at ON global_articles(created_at);
CREATE INDEX idx_global_products_tenant_category ON global_products(tenant_id, category);
CREATE INDEX idx_global_articles_tenant_category ON global_articles(tenant_id, category);
