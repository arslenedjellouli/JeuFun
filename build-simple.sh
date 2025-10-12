#!/bin/bash
set -e

echo "=== Starting Build Process ==="

echo "Installing dependencies..."
npm ci --only=production

echo "Installing Vite globally..."
npm install -g vite@latest

echo "Building application..."
vite build

echo "Verifying build..."
if [ -d "dist" ]; then
    echo "✅ Build successful! Contents of dist folder:"
    ls -la dist/
else
    echo "❌ Build failed - dist folder not found"
    exit 1
fi

echo "=== Build Completed Successfully ==="
