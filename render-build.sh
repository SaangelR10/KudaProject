#!/bin/bash
set -e

echo "🚀 Starting build process..."

# Ensure we're using Node.js
echo "📦 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Install dependencies
echo "📥 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Verify the build output
echo "✅ Build completed. Checking dist directory..."
ls -la dist/

echo "🎉 Build process completed successfully!"