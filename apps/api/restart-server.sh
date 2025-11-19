#!/bin/bash

echo "🔄 Reiniciando servidor PM2..."

# Navigate to backend directory
cd /home/fernandinhomartins040/fuseloja/backend

# Pull latest changes
echo "📦 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📋 Installing dependencies..."
npm ci --production

# Restart PM2 process
echo "🚀 Restarting PM2 process..."
npx pm2 restart fuseloja-minimal

# Show status
echo "📊 PM2 Status:"
npx pm2 status

echo "✅ Server restart completed!"