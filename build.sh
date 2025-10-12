#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Building application with npx..."
npx vite build

echo "Build completed successfully!"
