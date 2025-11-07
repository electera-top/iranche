#!/bin/bash

# Script to setup SSL certificate with Let's Encrypt for iranche.com

set -e

DOMAIN="iranche.com"
EMAIL="admin@iranche.com"  # Change this to your email

echo "==================================="
echo "Setting up SSL for $DOMAIN"
echo "==================================="

# Create a temporary Nginx config without SSL for initial certificate
TEMP_CONF="/etc/nginx/conf.d/iranche-temp.conf"

sudo tee $TEMP_CONF > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Reload Nginx with temporary config
sudo nginx -t && sudo systemctl reload nginx

# Obtain SSL certificate
echo "🔒 Obtaining SSL certificate from Let's Encrypt..."
sudo certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Remove temporary config
sudo rm -f $TEMP_CONF

# Install the full Nginx config with SSL
sudo cp nginx-iranche.conf /etc/nginx/conf.d/iranche.conf

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# Setup auto-renewal
echo "⚙️ Setting up automatic certificate renewal..."
sudo systemctl enable certbot-renew.timer
sudo systemctl start certbot-renew.timer

echo "==================================="
echo "✅ SSL certificate installed successfully!"
echo "==================================="
echo ""
echo "Your site is now available at: https://$DOMAIN"
echo "Certificate will auto-renew before expiration"
echo "==================================="

