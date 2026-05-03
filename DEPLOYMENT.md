# TaskForge Deployment Guide

This guide covers deploying TaskForge using Docker and various cloud platforms.

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)

### Quick Start with Docker

1. **Clone the repository**
```bash
git clone https://github.com/Pavan143Kundeti/taskforge.git
cd taskforge
```

2. **Create environment file**
```bash
# Copy the example env file
cp .env.docker .env

# Edit .env and update:
# - DB_PASSWORD (your database password)
# - JWT_SECRET (generate a random secret)
```

3. **Build and start all services**
```bash
docker-compose up -d
```

This single command will:
- ✅ Start PostgreSQL database
- ✅ Build and start the backend API
- ✅ Build and start the frontend
- ✅ Run database migrations automatically
- ✅ Set up networking between services

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

5. **Seed the database (optional)**
```bash
docker-compose exec backend npx tsx prisma/seed.ts
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart a service
docker-compose restart backend

# Rebuild after code changes
docker-compose up -d --build

# Stop and remove everything (including volumes)
docker-compose down -v
```

---

## ☁️ Cloud Deployment Options

### Option 1: Railway (Easiest)

Railway provides free hosting with PostgreSQL included.

#### Deploy Backend

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Deploy Backend**
```bash
cd backend
railway init
railway add postgresql
railway up
```

4. **Set Environment Variables**
```bash
railway variables set JWT_SECRET="your-secret-key"
railway variables set NODE_ENV="production"
railway variables set FRONTEND_URL="https://your-frontend-url.railway.app"
```

5. **Get Backend URL**
```bash
railway domain
# Copy the URL (e.g., https://taskforge-backend.railway.app)
```

#### Deploy Frontend

1. **Update API URL**
```bash
cd ../frontend
# Create .env file
echo "VITE_API_URL=https://your-backend-url.railway.app/api" > .env
```

2. **Deploy Frontend**
```bash
railway init
railway up
```

3. **Update Backend CORS**
```bash
cd ../backend
railway variables set FRONTEND_URL="https://your-frontend-url.railway.app"
```

---

### Option 2: Render

Render offers free tier with PostgreSQL.

#### Deploy Backend

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: taskforge-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm start`
   - **Environment**: Node

5. Add Environment Variables:
   - `DATABASE_URL`: (from Render PostgreSQL)
   - `JWT_SECRET`: your-secret-key
   - `NODE_ENV`: production
   - `FRONTEND_URL`: your-frontend-url

6. Create PostgreSQL Database:
   - Click "New +" → "PostgreSQL"
   - Copy the Internal Database URL
   - Add it as `DATABASE_URL` in backend

#### Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect repository
3. Configure:
   - **Name**: taskforge-frontend
   - **Root Directory**: frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: dist

4. Add Environment Variable:
   - `VITE_API_URL`: https://your-backend-url.onrender.com/api

---

### Option 3: Vercel (Frontend) + Railway (Backend)

Best for production with CDN benefits.

#### Deploy Backend on Railway
Follow Railway backend steps above.

#### Deploy Frontend on Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Set Environment Variable**
```bash
vercel env add VITE_API_URL
# Enter: https://your-backend-url.railway.app/api
```

4. **Deploy to Production**
```bash
vercel --prod
```

---

### Option 4: AWS (Production)

For production deployments with full control.

#### Using AWS ECS + RDS

1. **Create RDS PostgreSQL Database**
2. **Build Docker Images**
```bash
docker build -t taskforge-backend ./backend
docker build -t taskforge-frontend ./frontend
```

3. **Push to ECR**
```bash
aws ecr create-repository --repository-name taskforge-backend
aws ecr create-repository --repository-name taskforge-frontend

# Tag and push images
docker tag taskforge-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/taskforge-backend:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/taskforge-backend:latest
```

4. **Create ECS Task Definitions and Services**
5. **Configure Load Balancer**
6. **Set up CloudFront for Frontend**

---

### Option 5: DigitalOcean App Platform

1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect GitHub repository
4. Configure components:
   - **Backend**: Web Service (backend folder)
   - **Frontend**: Static Site (frontend folder)
   - **Database**: PostgreSQL

---

## 🔒 Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update `DATABASE_URL` with production database
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS with actual frontend URL
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Review and update rate limits
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables securely
- [ ] Test all features in production environment

---

## 🔧 Environment Variables Reference

### Backend
```env
DATABASE_URL=postgresql://user:password@host:5432/taskforge
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## 📊 Monitoring

### Health Checks

- Backend: `GET /health`
- Returns: `{ status: "ok", timestamp: "..." }`

### Logs

```bash
# Docker
docker-compose logs -f

# Railway
railway logs

# Render
View in dashboard
```

---

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check if database is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U postgres -d taskforge
```

### Backend Not Starting
```bash
# Check logs
docker-compose logs backend

# Common issues:
# - DATABASE_URL incorrect
# - Migrations not run
# - Port already in use
```

### Frontend Not Loading
```bash
# Check if API URL is correct
# View browser console for errors
# Verify CORS settings in backend
```

---

## 🚀 Performance Tips

1. **Enable Gzip Compression** (already configured in nginx)
2. **Use CDN** for frontend assets (Vercel/Cloudflare)
3. **Database Connection Pooling** (Prisma handles this)
4. **Redis Caching** (optional, for scaling)
5. **Load Balancing** (for high traffic)

---

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend instances
docker-compose up -d --scale backend=3
```

### Database Scaling
- Use read replicas for read-heavy workloads
- Implement connection pooling
- Add Redis for caching

---

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Run new migrations
docker-compose exec backend npx prisma migrate deploy
```

### Database Backups

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres taskforge > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres taskforge < backup.sql
```

---

## 📞 Support

For deployment issues:
1. Check logs first
2. Review environment variables
3. Verify network connectivity
4. Check GitHub Issues
5. Contact support

---

**Happy Deploying! 🎉**
