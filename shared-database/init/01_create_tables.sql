-- Create main database for tenant management
CREATE DATABASE IF NOT EXISTS shop_management;
USE shop_management;

-- Tenants table - stores all shop information
CREATE TABLE IF NOT EXISTS tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subdomain VARCHAR(63) NOT NULL UNIQUE,
    shop_name VARCHAR(255) NOT NULL,
    shop_description TEXT,
    owner_name VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    owner_phone VARCHAR(20),
    database_name VARCHAR(64) NOT NULL UNIQUE,
    database_user VARCHAR(64) NOT NULL,
    database_password VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'pending',
    plan_type ENUM('free', 'basic', 'premium', 'enterprise') DEFAULT 'free',
    storage_limit BIGINT DEFAULT 1073741824, -- 1GB in bytes
    storage_used BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    admin_username VARCHAR(50) NOT NULL,
    admin_password VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) NOT NULL,
    theme VARCHAR(100) DEFAULT 'default',
    plugins JSON,
    settings JSON,
    INDEX idx_subdomain (subdomain),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Tenant domains table - for custom domains
CREATE TABLE IF NOT EXISTS tenant_domains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    is_primary BOOLEAN DEFAULT FALSE,
    ssl_status ENUM('pending', 'active', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_domain (domain)
);

-- Tenant statistics table
CREATE TABLE IF NOT EXISTS tenant_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    date DATE NOT NULL,
    visitors INT DEFAULT 0,
    page_views INT DEFAULT 0,
    orders INT DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0.00,
    products_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tenant_date (tenant_id, date),
    INDEX idx_tenant_date (tenant_id, date)
);

-- Global products aggregation table
CREATE TABLE IF NOT EXISTS global_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    category VARCHAR(100),
    brand VARCHAR(100),
    images JSON,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    stock_status ENUM('in_stock', 'out_of_stock', 'on_backorder') DEFAULT 'in_stock',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_product_name (product_name),
    INDEX idx_category (category),
    INDEX idx_brand (brand),
    INDEX idx_price (price),
    INDEX idx_rating (rating),
    FULLTEXT idx_search (product_name, product_description, category, brand)
);

-- Global articles aggregation table
CREATE TABLE IF NOT EXISTS global_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    article_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    excerpt TEXT,
    author VARCHAR(100),
    category VARCHAR(100),
    tags JSON,
    featured_image VARCHAR(255),
    status ENUM('published', 'draft', 'private') DEFAULT 'published',
    view_count INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_title (title),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_search (title, content, excerpt)
);

-- Global brands table
CREATE TABLE IF NOT EXISTS global_brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    brand_id INT NOT NULL,
    brand_name VARCHAR(100) NOT NULL,
    brand_description TEXT,
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    product_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_brand_name (brand_name),
    INDEX idx_rating (rating),
    UNIQUE KEY unique_tenant_brand (tenant_id, brand_id)
);

-- Global ratings and reviews table
CREATE TABLE IF NOT EXISTS global_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    item_type ENUM('product', 'article', 'brand', 'shop') NOT NULL,
    item_id INT NOT NULL,
    user_id INT NOT NULL,
    user_name VARCHAR(100),
    user_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_content TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_item_type (item_type),
    INDEX idx_item_id (item_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('max_tenants', '1000', 'number', 'Maximum number of tenants allowed'),
('default_storage_limit', '1073741824', 'number', 'Default storage limit in bytes (1GB)'),
('allowed_themes', '["default", "storefront", "astra", "oceanwp"]', 'json', 'List of allowed themes'),
('allowed_plugins', '["woocommerce", "yoast-seo", "contact-form-7"]', 'json', 'List of allowed plugins'),
('main_domain', 'example.com', 'string', 'Main domain for subdomains'),
('ssl_enabled', 'true', 'boolean', 'Enable SSL for all tenants'),
('auto_backup', 'true', 'boolean', 'Enable automatic backups'),
('backup_retention_days', '30', 'number', 'Number of days to keep backups');

-- Create indexes for better performance
CREATE INDEX idx_tenants_status_created ON tenants(status, created_at);
CREATE INDEX idx_global_products_active ON global_products(is_active, rating);
CREATE INDEX idx_global_articles_published ON global_articles(status, created_at);
CREATE INDEX idx_global_brands_active ON global_brands(is_active, rating);
