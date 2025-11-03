FROM wordpress:php8.1-fpm

# Install WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Install additional dependencies
RUN apt-get update && apt-get install -y \
    mysql-client \
    unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

EXPOSE 9000

CMD ["php-fpm"]

