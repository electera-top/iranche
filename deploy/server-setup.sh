#!/bin/bash

# Script to setup Alma Linux server for Next.js deployment
# Server: 178.239.147.72
# Domain: iranche.com

set -e

echo "==================================="
echo "Starting Server Setup for iranche.com"
echo "==================================="

# Update system
echo "📦 Updating system packages..."
sudo dnf update -y
sudo dnf install -y epel-release

# Install essential tools
echo "🔧 Installing essential tools..."
sudo dnf install -y git curl wget vim nano

# Install Node.js 20.x
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Install PM2 globally
echo "🚀 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "🌐 Installing Nginx..."
sudo dnf install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Certbot for SSL
echo "🔒 Installing Certbot for SSL..."
sudo dnf install -y certbot python3-certbot-nginx

# Configure firewall
echo "🔥 Configuring firewall..."
sudo dnf install -y firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload

# Create directory for the project
echo "📁 Creating project directory..."
sudo mkdir -p /var/www/iranche
sudo chown -R $USER:$USER /var/www/iranche

echo "==================================="
echo "✅ Server setup completed successfully!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Clone the repository"
echo "2. Configure Nginx"
echo "3. Deploy the application"
echo "==================================="

