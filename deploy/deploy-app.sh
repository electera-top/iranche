#!/bin/bash

# Deployment script for iranche.com Next.js application
# This script clones the repository, builds and deploys the application

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_DIR="${PROJECT_DIR:-/var/www/iranche}"
REPO_URL="https://github.com/electera-top/iranche.git"
PM2_APP_NAME="iranche-frontend"
DEFAULT_BRANCH="${DEPLOY_BRANCH:-master}"

# Resolve project directory: prefer /var/www/iranche if it already hosts the repo,
# otherwise fall back to the directory containing this script.
if [ ! -d "$PROJECT_DIR/.git" ] && [ -d "$DEFAULT_PROJECT_DIR/.git" ]; then
    PROJECT_DIR="$DEFAULT_PROJECT_DIR"
fi

APP_DIR="$PROJECT_DIR/public-frontend"

echo "==================================="
echo "Starting Deployment for iranche.com"
echo "==================================="

# Clone or update repository
if [ -d "$PROJECT_DIR/.git" ]; then
    echo "📦 Updating existing repository..."
    cd "$PROJECT_DIR"
    git fetch origin --prune
    git checkout "$DEFAULT_BRANCH" 2>/dev/null || git checkout -B "$DEFAULT_BRANCH"
    git pull --ff-only origin "$DEFAULT_BRANCH"
else
    echo "📦 Cloning repository..."
    sudo rm -rf "$PROJECT_DIR"
    git clone --branch "$DEFAULT_BRANCH" "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# Navigate to public-frontend directory
cd "$APP_DIR"

# Validate frontend directory contents
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in $APP_DIR"
    echo "   Verify that the repository clone completed successfully."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Build the application
echo "🔨 Building Next.js application..."
npm run build

# Stop existing PM2 process if running
echo "🛑 Stopping existing process..."
pm2 stop "$PM2_APP_NAME" || true
pm2 delete "$PM2_APP_NAME" || true

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start npm --name "$PM2_APP_NAME" -- start
pm2 save

# Setup PM2 to start on system boot
echo "⚙️ Configuring PM2 startup..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u "$USER" --hp "/home/$USER"
pm2 save

echo "==================================="
echo "✅ Deployment completed successfully!"
echo "==================================="
echo ""
echo "Application is running on http://localhost:3000"
echo "You can check the status with: pm2 status"
echo "View logs with: pm2 logs $PM2_APP_NAME"
echo "==================================="