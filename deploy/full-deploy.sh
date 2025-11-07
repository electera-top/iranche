#!/bin/bash

# Complete deployment script for iranche.com
# This script runs all deployment steps in sequence

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd $SCRIPT_DIR

echo "╔════════════════════════════════════════════════╗"
echo "║   Complete Deployment for iranche.com          ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Function to print section headers
print_section() {
    echo ""
    echo "╔════════════════════════════════════════════════╗"
    echo "║  $1"
    echo "╚════════════════════════════════════════════════╝"
    echo ""
}

# Step 1: Server Setup
print_section "Step 1/4: Setting up server (Node.js, Nginx, etc.)"
./server-setup.sh

# Step 2: Deploy Application
print_section "Step 2/4: Deploying Next.js application"
./deploy-app.sh

# Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 5

# Check if application is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is running successfully on port 3000"
else
    echo "⚠️  Warning: Application might not be running on port 3000"
    echo "   Check logs with: pm2 logs iranche-frontend"
fi

# Step 3: Setup Nginx
print_section "Step 3/4: Configuring Nginx"
./setup-nginx.sh

# Step 4: Setup SSL (optional, can be skipped if DNS not ready)
print_section "Step 4/4: Setting up SSL certificate"
echo "⚠️  Note: This step requires DNS to be properly configured"
echo "   If DNS is not ready, you can run ./setup-ssl.sh later"
echo ""
read -p "Do you want to setup SSL now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Ask for email
    read -p "Enter your email for SSL certificate: " email
    # Modify setup-ssl.sh with the provided email
    sed -i "s/admin@iranche.com/$email/" setup-ssl.sh
    ./setup-ssl.sh
else
    echo "⏭️  Skipping SSL setup. You can run it later with: ./setup-ssl.sh"
    echo "   For now, the site will be available at: http://iranche.com"
fi

# Final status
print_section "Deployment Summary"
echo "✅ Server setup completed"
echo "✅ Application deployed and running"
echo "✅ Nginx configured"
echo ""
echo "📊 Application Status:"
pm2 status
echo ""
echo "🌐 Your site is available at:"
echo "   - Local: http://localhost:3000"
echo "   - Public: http://iranche.com"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   - HTTPS: https://iranche.com"
fi
echo ""
echo "📝 Useful commands:"
echo "   pm2 status                  - Check application status"
echo "   pm2 logs iranche-frontend   - View application logs"
echo "   pm2 restart iranche-frontend - Restart application"
echo "   systemctl status nginx      - Check Nginx status"
echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║   Deployment Completed Successfully! 🎉        ║"
echo "╚════════════════════════════════════════════════╝"

