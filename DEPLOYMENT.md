# CampusConnect - Deployment Guide

This guide will help you deploy CampusConnect to production environments.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB database setup (local or Atlas)
- [ ] Environment variables configured
- [ ] Frontend built and tested
- [ ] Backend tested with production database
- [ ] Domain name (optional)
- [ ] SSL certificate (provided by hosting platforms)

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free tier available)

### Step 2: Configure Database
1. Click "Connect" on your cluster
2. Add your IP address (or allow all: 0.0.0.0/0)
3. Create a database user with password
4. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/campusconnect
   ```

### Step 3: Seed Production Database
```bash
# Update backend/.env with Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusconnect

# Run seed script
cd backend
npm run seed
```

## 🚀 Backend Deployment

### Option 1: Deploy to Render

1. **Create Account**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `CampusConnect` repository

3. **Configure Service**
   - Name: `campusconnect-api`
   - Environment: `Node`
   - Region: Choose closest to your users
   - Branch: `main` (or your production branch)
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusconnect
   JWT_SECRET=your_super_secret_production_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://campusconnect-api.onrender.com`

### Option 2: Deploy to Railway

1. **Create Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `CampusConnect` repository
   - Select "backend" as root directory

3. **Configure**
   - Add environment variables (same as Render)
   - Railway will auto-detect Node.js
   - Get deployment URL from dashboard

### Option 3: Deploy to Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
cd backend
heroku create campusconnect-api

# Add MongoDB Atlas add-on (or use your own)
heroku config:set MONGODB_URI="your_connection_string"
heroku config:set JWT_SECRET="your_secret"
heroku config:set FRONTEND_URL="your_frontend_url"

# Deploy
git push heroku main

# Scale
heroku ps:scale web=1

# View logs
heroku logs --tail
```

## 🎨 Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Create Account**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import `CampusConnect` repository
   - Framework Preset: Vite
   - Root Directory: `frontend`

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   ```
   VITE_API_URL=https://campusconnect-api.onrender.com/api
   VITE_SOCKET_URL=https://campusconnect-api.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Get your URL: `https://campusconnect.vercel.app`

### Option 2: Deploy to Netlify

1. **Create Account**
   - Go to [Netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Choose `CampusConnect` repository
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Add Environment Variables**
   - Site settings → Environment variables
   - Add VITE_API_URL and VITE_SOCKET_URL

4. **Deploy**
   - Click "Deploy site"
   - Wait for build
   - Get your Netlify URL

### Option 3: Deploy to GitHub Pages

```bash
# Install gh-pages
cd frontend
npm install --save-dev gh-pages

# Add to package.json scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Update vite.config.js
export default defineConfig({
  base: '/CampusConnect/',
  // ... rest of config
})

# Deploy
npm run deploy
```

## 🔒 Post-Deployment Security

### 1. Update Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb+srv://prod_user:strong_password@cluster.mongodb.net/campusconnect
JWT_SECRET=use_openssl_rand_base64_32_to_generate_this
JWT_EXPIRE=7d
FRONTEND_URL=https://your-actual-frontend-url.vercel.app
NODE_ENV=production
```

**Frontend (.env)**
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

### 2. Enable CORS Properly

Update `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 3. MongoDB Security
- Use strong passwords
- Enable IP whitelist
- Enable MongoDB encryption at rest
- Regular backups

### 4. Rate Limiting (Optional)

```bash
cd backend
npm install express-rate-limit
```

Add to `server.js`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 🔍 Monitoring & Maintenance

### 1. Check Logs
- **Render**: Dashboard → Logs
- **Vercel**: Deployment → Function Logs
- **Railway**: Project → Logs

### 2. Monitor Uptime
Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

### 3. Database Monitoring
- MongoDB Atlas → Metrics
- Set up alerts for high usage

### 4. Performance Monitoring
- Use Vercel Analytics
- Google Analytics
- Sentry for error tracking

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

1. **Enable Auto-Deploy**
   - Connected to your GitHub repository
   - Deploys automatically on push to main branch

2. **Branch Previews**
   - Vercel creates preview URLs for pull requests
   - Test before merging to production

## 🌐 Custom Domain Setup

### For Vercel
1. Go to Project Settings → Domains
2. Add your domain: `campusconnect.yourdomain.com`
3. Update DNS records (Vercel provides instructions)
4. Wait for SSL certificate (automatic)

### For Render
1. Go to Settings → Custom Domains
2. Add domain
3. Update DNS with provided CNAME
4. SSL is automatic

## 📊 Production Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] Database seeded with initial data
- [ ] Frontend API URL points to production backend
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled (automatic on most platforms)
- [ ] Error monitoring setup
- [ ] Backup strategy in place
- [ ] Domain configured (if using custom domain)
- [ ] Admin account created
- [ ] Test all features in production
- [ ] Check mobile responsiveness
- [ ] Performance testing done
- [ ] Security audit completed

## 🆘 Troubleshooting

### Frontend can't connect to Backend
- Check CORS settings
- Verify API URL in frontend .env
- Check browser console for errors
- Verify backend is running

### Database Connection Failed
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check database user permissions
- Try connecting with MongoDB Compass

### Build Fails
- Check build logs
- Verify all dependencies in package.json
- Test build locally first
- Check Node.js version compatibility

### 500 Internal Server Error
- Check backend logs
- Verify environment variables
- Check database connection
- Review error handling

## 📱 Mobile Optimization

The app is already responsive, but consider:
- Testing on actual devices
- Using Chrome DevTools mobile view
- Checking touch targets (min 44x44px)
- Testing on slow 3G connection

## 🚦 Load Testing

Before heavy usage:
```bash
# Install Apache Bench
apt-get install apache2-utils

# Test backend
ab -n 1000 -c 10 https://your-backend-url/api/posts

# Analyze results
```

## 📈 Scaling Considerations

As your app grows:
1. **Database**: Upgrade MongoDB Atlas tier
2. **Backend**: Scale Render/Railway instances
3. **Frontend**: Vercel scales automatically
4. **CDN**: Already included in Vercel/Netlify
5. **Caching**: Add Redis for sessions
6. **Load Balancer**: Use platform-provided load balancing

## 🎉 You're Live!

After deployment:
1. Share the URL with your college
2. Create announcement in Official section
3. Monitor initial usage
4. Gather feedback
5. Plan improvements

---

**Congratulations!** Your CampusConnect platform is now live! 🎓

For support: Open an issue on GitHub or check the documentation.
