#!/bin/bash

echo "🚀 Setting up RelationSync for local development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create environment files if they don't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file..."
    cat > .env << EOL
# Frontend Environment Variables (Local Development)
VITE_API_URL=http://localhost:5000
EOL
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cat > backend/.env << EOL
# Database Configuration (Update with your database)
DATABASE_URL=postgresql://username:password@localhost:5432/relationsync
# OR use Supabase (recommended)
# SUPABASE_URL=your_supabase_project_url
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# SUPABASE_DB_URL=your_supabase_postgres_connection_string

# JWT Configuration
JWT_SECRET=relationsync_super_secret_jwt_key_2024_local_development
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Your Gmail)
EMAIL_USER=spectrasafemanager@gmail.com
EMAIL_APP_PASSWORD=iavbafexoqaweugq

# Frontend URL (Local development)
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
EOL
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your database in backend/.env"
echo "2. Run: npm run full-dev"
echo "3. Open: http://localhost:5173"
echo ""
echo "📖 See LOCAL_SETUP.md for detailed instructions"