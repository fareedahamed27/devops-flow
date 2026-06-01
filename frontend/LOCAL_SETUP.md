# 🚀 RelationSync - Local Development Setup

## 📋 Prerequisites

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Git** - [Download here](https://git-scm.com/)
3. **PostgreSQL** (optional - can use Supabase instead)

## 🛠 Quick Setup (5 minutes)

### 1. **Clone & Install**
```bash
# Clone the repository
git clone <your-repo-url>
cd relationsync

# Install all dependencies (frontend + backend)
npm run setup
```

### 2. **Database Setup (Choose One)**

#### Option A: Supabase (Recommended - Free)
1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to Settings → Database → Connection string
4. Copy the connection details
5. Update `backend/.env` with your Supabase credentials

#### Option B: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Create database
createdb relationsync

# Run migrations
cd backend
psql -d relationsync -f ../supabase/migrations/20250629080517_stark_portal.sql
psql -d relationsync -f ../supabase/migrations/20250629080542_rough_bar.sql
```

### 3. **Environment Configuration**
```bash
# Backend environment (backend/.env)
DATABASE_URL=your_database_connection_string
EMAIL_USER=spectrasafemanager@gmail.com
EMAIL_APP_PASSWORD=iavbafexoqaweugq
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173

# Frontend environment (.env)
VITE_API_URL=http://localhost:5000
```

### 4. **Start Development**
```bash
# Start both frontend and backend together
npm run full-dev

# OR start separately:
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend  
npm run dev
```

## 🌐 Access Your App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📧 Email Service

✅ **Already configured with your Gmail:**
- Emails will be sent from: `spectrasafemanager@gmail.com`
- Welcome emails and partner invitations work automatically

## 🚀 Deploy to Your Domain

### Option 1: Netlify + Railway (Easiest)

#### Frontend (Netlify):
1. Push code to GitHub
2. Connect GitHub to Netlify
3. Deploy automatically
4. Add custom domain in Netlify settings

#### Backend (Railway):
1. Connect GitHub to Railway
2. Deploy backend folder
3. Add environment variables
4. Get Railway URL and update frontend

### Option 2: Your Own Server (VPS)

#### Frontend:
```bash
# Build for production
npm run build

# Upload dist/ folder to your web server
# Configure nginx/apache to serve static files
```

#### Backend:
```bash
# On your server
git clone <your-repo>
cd relationsync/backend
npm install --production
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name relationsync-api
```

### Option 3: Docker (Advanced)

```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Development Commands

```bash
# Install dependencies
npm run setup

# Start development (both frontend + backend)
npm run full-dev

# Start only frontend
npm run dev

# Start only backend
npm run backend

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
relationsync/
├── src/                 # Frontend React app
├── backend/            # Node.js API server
├── supabase/          # Database migrations
├── dist/              # Built frontend (after npm run build)
└── docs/              # Documentation
```

## 🐛 Troubleshooting

### Database Connection Issues:
```bash
# Check if PostgreSQL is running
pg_isready

# Test Supabase connection
curl -X GET 'https://your-project.supabase.co/rest/v1/' \
  -H "apikey: your-anon-key"
```

### Email Not Working:
- Verify Gmail app password is correct
- Check if 2FA is enabled on Gmail
- Ensure "Less secure app access" is enabled

### Port Already in Use:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Email service tested
- [ ] CORS configured for your domain
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Backup strategy in place

## 📞 Support

If you encounter any issues:
1. Check the console logs
2. Verify environment variables
3. Test database connection
4. Check email configuration

Your app is now ready for local development and production deployment! 🎉