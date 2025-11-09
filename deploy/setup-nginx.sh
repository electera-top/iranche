#!/bin/bash

# Script to configure Nginx for iranche.com

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONF="/etc/nginx/conf.d/iranche.conf"
DOMAIN="iranche.com"
SSL_CERT="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"
HTTP_CONF_SOURCE="$SCRIPT_DIR/nginx-iranche-http.conf"
SSL_CONF_SOURCE="$SCRIPT_DIR/nginx-iranche.conf"

echo "==================================="
echo "Configuring Nginx for $DOMAIN"
echo "==================================="

# Create directory for certbot challenges
sudo mkdir -p /var/www/certbot

# Choose configuration based on SSL availability
if [ -f "$SSL_CERT" ]; then
    echo "🔐 SSL certificate found. Installing HTTPS configuration..."
    sudo cp "$SSL_CONF_SOURCE" "$NGINX_CONF"
else
    echo "ℹ️  SSL certificate not found. Installing HTTP-only configuration."
    echo "   Run setup-ssl.sh after obtaining certificates to enable HTTPS."
    sudo cp "$HTTP_CONF_SOURCE" "$NGINX_CONF"
fi

# Test Nginx configuration
echo "✅ Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "==================================="
echo "✅ Nginx configured successfully!"
echo "==================================="