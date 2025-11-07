#!/bin/bash

# Script to configure Nginx for iranche.com

set -e

NGINX_CONF="/etc/nginx/conf.d/iranche.conf"
DOMAIN="iranche.com"

echo "==================================="
echo "Configuring Nginx for $DOMAIN"
echo "==================================="

# Create directory for certbot challenges
sudo mkdir -p /var/www/certbot

# Copy Nginx configuration
echo "📝 Installing Nginx configuration..."
sudo cp nginx-iranche.conf $NGINX_CONF

# Test Nginx configuration
echo "✅ Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "==================================="
echo "✅ Nginx configured successfully!"
echo "==================================="

