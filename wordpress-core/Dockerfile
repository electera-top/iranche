FROM php:8.1-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    nginx \
    mariadb-client \
    wget \
    gnupg \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mysqli \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    opcache

# Install WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www/html

# Download WordPress with increased memory limit
RUN php -d memory_limit=512M /usr/local/bin/wp core download --allow-root

# Copy custom wp-config.php template
COPY wp-config-template.php /var/www/html/wp-config-template.php

# Create necessary directories
RUN mkdir -p /var/www/tenants /var/www/backups /var/log/nginx

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chown -R www-data:www-data /var/www/tenants \
    && chmod -R 755 /var/www/tenants

# Copy PHP configuration
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Copy tenant installation script
COPY install-tenant.sh /install-tenant.sh
RUN chmod +x /install-tenant.sh

# Expose port
EXPOSE 9000

# Start PHP-FPM
CMD ["/start.sh"]
