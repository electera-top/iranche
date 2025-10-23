#!/bin/bash

# WordPress Installation Script for Multi-tenant System

echo "Starting WordPress installation for tenant: $TENANT_SUBDOMAIN"

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! mysqladmin ping -h"$WORDPRESS_DB_HOST" --silent; do
    sleep 1
done

echo "Database is ready!"

# Create tenant directory
TENANT_DIR="/var/www/tenants/$TENANT_SUBDOMAIN"
mkdir -p $TENANT_DIR

# Copy WordPress files to tenant directory
echo "Copying WordPress files to tenant directory..."
cp -r /var/www/html/* $TENANT_DIR/

# Set proper permissions
chown -R www-data:www-data $TENANT_DIR
chmod -R 755 $TENANT_DIR

# Generate wp-config.php for tenant
echo "Generating wp-config.php for tenant..."
cat > $TENANT_DIR/wp-config.php << 'EOF'
<?php
define( 'DB_NAME', '$TENANT_DB_NAME' );
define( 'DB_USER', '$TENANT_DB_USER' );
define( 'DB_PASSWORD', '$TENANT_DB_PASSWORD' );
define( 'DB_HOST', '$WORDPRESS_DB_HOST' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

define( 'AUTH_KEY',         '$(openssl rand -base64 32)' );
define( 'SECURE_AUTH_KEY',  '$(openssl rand -base64 32)' );
define( 'LOGGED_IN_KEY',    '$(openssl rand -base64 32)' );
define( 'NONCE_KEY',        '$(openssl rand -base64 32)' );
define( 'AUTH_SALT',        '$(openssl rand -base64 32)' );
define( 'SECURE_AUTH_SALT', '$(openssl rand -base64 32)' );
define( 'LOGGED_IN_SALT',   '$(openssl rand -base64 32)' );
define( 'NONCE_SALT',       '$(openssl rand -base64 32)' );

define( 'WP_DEBUG', false );
define( 'WP_DEBUG_LOG', false );
define( 'WP_DEBUG_DISPLAY', false );

define( 'WP_HOME', 'http://$TENANT_SUBDOMAIN.$MAIN_DOMAIN' );
define( 'WP_SITEURL', 'http://$TENANT_SUBDOMAIN.$MAIN_DOMAIN' );

$table_prefix = 'wp_';

/* Add any custom values between this line and the "stop editing" comment. */

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
EOF

# Install WordPress
echo "Installing WordPress for tenant: $TENANT_SUBDOMAIN"
cd $TENANT_DIR

# Run WordPress installation
wp core install \
    --url="http://$TENANT_SUBDOMAIN.$MAIN_DOMAIN" \
    --title="$TENANT_SHOP_NAME" \
    --admin_user="$TENANT_ADMIN_USER" \
    --admin_password="$TENANT_ADMIN_PASSWORD" \
    --admin_email="$TENANT_ADMIN_EMAIL" \
    --skip-email \
    --allow-root

echo "WordPress installation completed for tenant: $TENANT_SUBDOMAIN"

# Start PHP-FPM
echo "Starting PHP-FPM..."
php-fpm -F &

# Start Nginx
echo "Starting Nginx..."
nginx -g "daemon off;" &

# Wait for all background processes
wait
