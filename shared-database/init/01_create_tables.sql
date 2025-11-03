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

-- Unified categories table (floors are parent categories, subcategories reference parent_id)
CREATE TABLE IF NOT EXISTS tenant_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NULL,
    name VARCHAR(255) NOT NULL,
    short_description VARCHAR(500),
    long_description TEXT,
    icon VARCHAR(100) DEFAULT 'fas fa-tag',
    color VARCHAR(7) DEFAULT '#3B82F6',
    banner_url VARCHAR(500),
    status ENUM('active', 'inactive') DEFAULT 'active',
    start_number INT NULL,
    end_number INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES tenant_categories(id) ON DELETE CASCADE,
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status),
    INDEX idx_name (name),
    INDEX idx_start_number (start_number),
    INDEX idx_end_number (end_number)
);

-- Add category_id to tenants table
ALTER TABLE tenants ADD COLUMN category_id INT NULL AFTER plan_type;
ALTER TABLE tenants ADD FOREIGN KEY (category_id) REFERENCES tenant_categories(id) ON DELETE SET NULL;
ALTER TABLE tenants ADD INDEX idx_category_id (category_id);

-- File management table
CREATE TABLE IF NOT EXISTS files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    extension VARCHAR(10) NOT NULL,
    file_type ENUM('image', 'document', 'video', 'audio', 'archive', 'other') NOT NULL,
    uploaded_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_size BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    category ENUM('shops', 'users', 'core', 'categories', 'brands', 'chats', 'themes', 'plugins', 'services') NOT NULL,
    tenant_id INT NULL,
    INDEX idx_category (category),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_created_at (created_at),
    INDEX idx_file_type (file_type),
    INDEX idx_tenant_id (tenant_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    national_id VARCHAR(10) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    profile_image VARCHAR(500),
    wallet_rial DECIMAL(15,2) DEFAULT 0.00,
    wallet_gold DECIMAL(10,4) DEFAULT 0.0000,
    wallet_income DECIMAL(15,2) DEFAULT 0.00,
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_national_id (national_id),
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at)
);

-- Admins table - extends users with admin privileges
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active),
    INDEX idx_role (role)
);

-- Create indexes for better performance
CREATE INDEX idx_tenants_status_created ON tenants(status, created_at);
CREATE INDEX idx_global_products_active ON global_products(is_active, rating);
CREATE INDEX idx_global_articles_published ON global_articles(status, created_at);
CREATE INDEX idx_global_brands_active ON global_brands(is_active, rating);

-- Seed default admin (only if no admin exists)
INSERT INTO users (first_name, last_name, national_id, phone, profile_image)
SELECT 'Admin', 'User', '9999999999', '09000000000', NULL
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');

INSERT INTO admins (user_id, username, password, email, is_active, role)
SELECT u.id, 'admin', 'admin123', 'admin@example.com', TRUE, 'super_admin'
FROM users u
WHERE u.national_id = '9999999999'
AND NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');

-- Themes (templates) marketplace
CREATE TABLE IF NOT EXISTS themes (
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

-- Theme categories
CREATE TABLE IF NOT EXISTS theme_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES theme_categories(id) ON DELETE SET NULL,
    INDEX idx_parent_id (parent_id),
    INDEX idx_name (name)
);

-- Link theme to category
ALTER TABLE themes ADD COLUMN category_id INT NULL AFTER name;
ALTER TABLE themes ADD FOREIGN KEY (category_id) REFERENCES theme_categories(id) ON DELETE SET NULL;
ALTER TABLE themes ADD INDEX idx_category_id (category_id);

-- Plugins marketplace
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

-- Plugin categories
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

-- Link plugin to category
ALTER TABLE plugins ADD COLUMN category_id INT NULL AFTER name;
ALTER TABLE plugins ADD FOREIGN KEY (category_id) REFERENCES plugin_categories(id) ON DELETE SET NULL;
ALTER TABLE plugins ADD INDEX idx_category_id (category_id);

-- Theme installations/purchases per tenant
CREATE TABLE IF NOT EXISTS tenant_theme_installs (
	id INT AUTO_INCREMENT PRIMARY KEY,
	tenant_id INT NOT NULL,
	theme_id INT NOT NULL,
	is_active BOOLEAN DEFAULT FALSE,
	purchased_price BIGINT DEFAULT 0,
	license_key VARCHAR(255),
	installed_at TIMESTAMP NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
	FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
	UNIQUE KEY unique_tenant_theme (tenant_id, theme_id),
	INDEX idx_tenant_active (tenant_id, is_active)
);

-- Plugin installations/purchases per tenant
CREATE TABLE IF NOT EXISTS tenant_plugin_installs (
	id INT AUTO_INCREMENT PRIMARY KEY,
	tenant_id INT NOT NULL,
	plugin_id INT NOT NULL,
	is_active BOOLEAN DEFAULT FALSE,
	purchased_price BIGINT DEFAULT 0,
	license_key VARCHAR(255),
	installed_at TIMESTAMP NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
	FOREIGN KEY (plugin_id) REFERENCES plugins(id) ON DELETE CASCADE,
	UNIQUE KEY unique_tenant_plugin (tenant_id, plugin_id),
	INDEX idx_tenant_active (tenant_id, is_active)
);

-- Global banners table
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    position VARCHAR(100),
    status ENUM('active','inactive') DEFAULT 'active',
    tenant_id INT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_position (position),
    INDEX idx_tenant (tenant_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
);
