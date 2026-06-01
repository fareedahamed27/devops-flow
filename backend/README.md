# RelationSync Backend - Railway Deployment

## 🚀 Quick Deploy to Railway
# from project root
npm --prefix ./backend install
# default
npm --prefix ./backend run dev
# or explicit alternate port if 5000 is in use
PORT=5001 npm --prefix ./backend run dev
### 1. **Create Railway Account**
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 2. **Deploy Backend**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from backend folder
cd backend
railway deploy
```

### 3. **Set Environment Variables**
In Railway dashboard, add these variables:

```bash
# Database (Supabase)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_postgres_connection_string

# JWT
JWT_SECRET=relationsync_super_secret_jwt_key_2024_production_ready
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production

# Email (Already configured)
EMAIL_USER=spectrasafemanager@gmail.com
EMAIL_APP_PASSWORD=iavbafexoqaweugq

# Frontend
FRONTEND_URL=https://relationsync.netlify.app
CORS_ORIGIN=https://relationsync.netlify.app
```

### 4. **Alternative: One-Click Deploy**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)

## 📧 Email Configuration

✅ **Gmail SMTP Ready**
- Email: `spectrasafemanager@gmail.com`
- App Password: `iavbafexoqaweugq`
- Service: Gmail SMTP (port 587)

## 🔗 After Deployment

1. **Get your Railway URL** (e.g., `https://your-app.railway.app`)
2. **Update frontend environment**:
   ```bash
   VITE_API_URL=https://your-app.railway.app
   ```
3. **Redeploy frontend** to Netlify

## 🛠 Features Included

- ✅ **Production-ready** Express server
- ✅ **Gmail SMTP** email service
- ✅ **PostgreSQL** database support
- ✅ **JWT authentication**
- ✅ **CORS configuration**
- ✅ **Rate limiting**
- ✅ **Security headers**
- ✅ **Health check endpoint**

## 📊 API Endpoints

- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/questions` - Get questionnaire questions
- `POST /api/questionnaire/start` - Start questionnaire
- `POST /api/questionnaire/:id/answer` - Save answer
- `POST /api/questionnaire/:id/complete` - Complete questionnaire
- `POST /api/ai/generate-report/:sessionId` - Generate AI report
- `GET /api/ai/report` - Get user report
- `POST /api/pair-request` - Send pair request
- `POST /api/pair-approve` - Approve pair request

## 🔧 Local Development

```bash
cd backend
npm install
npm run dev
```

## 📝 Notes

- Email service is pre-configured with your Gmail credentials
- Database uses Supabase PostgreSQL
- All security features enabled for production
- CORS configured for your Netlify frontend