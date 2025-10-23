#!/bin/bash

# Start script for WordPress Multi-tenant System

echo "Starting WordPress Multi-tenant System..."

# Start PHP-FPM immediately
echo "Starting PHP-FPM..."
php-fpm -F &

# Start Nginx
echo "Starting Nginx..."
nginx -g "daemon off;" &

# Wait for all background processes
wait
