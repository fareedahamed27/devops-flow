#!/bin/bash

echo "🚀 Building RelationSync for production..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Create deployment package
echo "📁 Creating deployment package..."
mkdir -p deploy
cp -r dist deploy/frontend
cp -r backend deploy/backend

# Remove development files from backend
cd deploy/backend
rm -rf node_modules
rm -f .env
npm install --production
cd ../..

echo ""
echo "✅ Production build complete!"
echo ""
echo "📁 Deployment files are in the 'deploy' folder:"
echo "   - deploy/frontend/ (upload to your web server)"
echo "   - deploy/backend/ (upload to your API server)"
echo ""
echo "🌐 Don't forget to:"
echo "1. Update environment variables for production"
echo "2. Configure your web server (nginx/apache)"
echo "3. Set up SSL certificate"
echo "4. Configure domain DNS"