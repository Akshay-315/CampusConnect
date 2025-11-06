# CampusConnect - Quick Start Guide

## Prerequisites

Before running CampusConnect, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **MongoDB** (v5.0 or higher)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   - Verify: `mongod --version`

3. **npm** (comes with Node.js)
   - Verify: `npm --version`

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Akshay-315/CampusConnect.git
cd CampusConnect
```

### 2. Start MongoDB

#### Option A: Local MongoDB
```bash
# Start MongoDB service
sudo systemctl start mongod
# or on Mac with homebrew:
brew services start mongodb-community

# Verify it's running
mongosh
```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Use this in your `.env` file

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use any text editor

# For MongoDB Atlas, update MONGODB_URI:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusconnect

# Seed the database with sample data
node seed.js

# Start the backend server
npm run dev
```

You should see:
```
✅ MongoDB Connected: ...
╔═══════════════════════════════════════╗
║   🎓 CampusConnect Server Running    ║
║   📡 Port: 5000                       ║
║   🌐 http://localhost:5000            ║
╚═══════════════════════════════════════╝
```

### 4. Setup Frontend

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 5. Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Demo Accounts

After seeding the database, you can login with:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@college.edu | admin123 |
| **Faculty** | sarah.johnson@college.edu | faculty123 |
| **Student** | john.doe@college.edu | student123 |

## Testing the Features

1. **Login** as a student and explore the Student section
2. **Post** in the Student section
3. **Comment** on existing posts
4. **Try Anonymous** section (no login required)
5. **Login as Faculty** and post in Official section
6. **Verify posts** as Faculty
7. **Login as Admin** to access the admin dashboard

## Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB Connection Error: connect ECONNREFUSED
```
**Solution**: Make sure MongoDB is running
```bash
sudo systemctl start mongod
# or
mongod --dbpath ~/data/db
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change the port in backend/.env or kill the process using that port
```bash
# Find process
lsof -i :5000
# Kill it
kill -9 <PID>
```

### Cannot Connect to Backend
- Check if backend is running on port 5000
- Check browser console for CORS errors
- Verify FRONTEND_URL in backend/.env matches your frontend URL

### Dependencies Installation Fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Production Deployment

### Backend (Render/Heroku/Railway)

1. Create account on Render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables:
   - MONGODB_URI (use MongoDB Atlas)
   - JWT_SECRET
   - FRONTEND_URL (your frontend URL)
7. Deploy!

### Frontend (Vercel/Netlify)

1. Create account on Vercel.com
2. Import your GitHub repository
3. Set root directory: `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables:
   - VITE_API_URL (your backend URL)
   - VITE_SOCKET_URL (your backend URL)
7. Deploy!

## Development Commands

### Backend
```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
node seed.js    # Seed database with sample data
```

### Frontend
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## Need Help?

- Check the [README.md](README.md) for detailed information
- Open an issue on GitHub
- Check existing issues for solutions

## Next Steps

1. Customize the application for your college
2. Add more features
3. Improve the UI/UX
4. Add email notifications
5. Implement file uploads
6. Add search functionality

---

**Happy Coding! 🚀**
