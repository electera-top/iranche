#!/bin/bash

# Deployment script for iranche.com Next.js application
# This script clones the repository, builds and deploys the application

set -e

PROJECT_DIR="/var/www/iranche"
REPO_URL="https://github.com/electera-top/iranche.git"
APP_DIR="$PROJECT_DIR/public-frontend"
PM2_APP_NAME="iranche-frontend"

echo "==================================="
echo "Starting Deployment for iranche.com"
echo "==================================="

# Clone or update repository
if [ -d "$PROJECT_DIR/.git" ]; then
    echo "📦 Updating existing repository..."
    cd $PROJECT_DIR
    git pull origin main || git pull origin master
else
    echo "📦 Cloning repository..."
    sudo rm -rf $PROJECT_DIR
    git clone $REPO_URL $PROJECT_DIR
fi

# Navigate to public-frontend directory
cd $APP_DIR

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Build the application
echo "🔨 Building Next.js application..."
npm run build

# Stop existing PM2 process if running
echo "🛑 Stopping existing process..."
pm2 stop $PM2_APP_NAME || true
pm2 delete $PM2_APP_NAME || true

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start npm --name $PM2_APP_NAME -- start
pm2 save

# Setup PM2 to start on system boot
echo "⚙️ Configuring PM2 startup..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
pm2 save

echo "==================================="
echo "✅ Deployment completed successfully!"
echo "==================================="
echo ""
echo "Application is running on http://localhost:3000"
echo "You can check the status with: pm2 status"
echo "View logs with: pm2 logs $PM2_APP_NAME"
echo "==================================="

