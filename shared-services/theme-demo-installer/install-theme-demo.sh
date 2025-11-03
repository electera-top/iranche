#!/bin/bash

# Install WordPress theme demo
# Usage: install-theme-demo.sh <theme-slug> <theme-path>

THEME_SLUG=$1
THEME_PATH=$2
WP_ROOT="/var/www/themes"

if [ -z "$THEME_SLUG" ] || [ -z "$THEME_PATH" ]; then
    echo "Usage: install-theme-demo.sh <theme-slug> <theme-path>"
    exit 1
fi

echo "Installing WordPress demo for theme: $THEME_SLUG"

# Wait for database
while ! mysqladmin ping -h"${WORDPRESS_DB_HOST:-main-db}" --silent; do
    sleep 1
done

# Check if WordPress is installed
if [ ! -f "$WP_ROOT/wp-config.php" ]; then
    echo "WordPress not installed, installing..."
    
    # Download WordPress
    cd $WP_ROOT
    wp core download --allow-root
    
    # Create wp-config.php
    wp core config \
        --dbname="${WORDPRESS_DB_NAME:-themes_demo}" \
        --dbuser="${WORDPRESS_DB_USER:-root}" \
        --dbpass="${WORDPRESS_DB_PASSWORD}" \
        --dbhost="${WORDPRESS_DB_HOST:-main-db}" \
        --allow-root
    
    # Install WordPress
    wp core install \
        --url="http://themes.localhost" \
        --title="Theme Demos" \
        --admin_user="admin" \
        --admin_password="admin123" \
        --admin_email="admin@themes.localhost" \
        --skip-email \
        --allow-root
    
    # Install WooCommerce
    wp plugin install woocommerce --activate --allow-root
    
    # Import sample products
    wp wc tool run install_pages --user=1 --allow-root || true
fi

# Copy theme to wp-content/themes/
if [ -d "$THEME_PATH" ]; then
    echo "Copying theme files..."
    cp -r "$THEME_PATH" "$WP_ROOT/wp-content/themes/$THEME_SLUG/"
    
    # Activate theme
    wp theme activate "$THEME_SLUG" --allow-root
    
    echo "Theme $THEME_SLUG installed and activated"
else
    echo "Theme path not found: $THEME_PATH"
    exit 1
fi

