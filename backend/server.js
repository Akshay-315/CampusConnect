import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';

// Load env variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: '🎓 Welcome to CampusConnect API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      posts: '/api/posts',
      comments: '/api/comments',
      notifications: '/api/notifications',
      admin: '/api/admin',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // User joins with their ID
  socket.on('join', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Send notification to specific user
  socket.on('notification', ({ recipientId, notification }) => {
    const recipientSocketId = connectedUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('notification', notification);
    }
  });

  // Broadcast new post
  socket.on('newPost', (post) => {
    socket.broadcast.emit('newPost', post);
  });

  // Broadcast new comment
  socket.on('newComment', ({ postId, comment }) => {
    socket.broadcast.emit('newComment', { postId, comment });
  });

  // User disconnects
  socket.on('disconnect', () => {
    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Make io accessible to our routes
app.set('io', io);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════╗
    ║   🎓 CampusConnect Server Running    ║
    ║   📡 Port: ${PORT}                     ║
    ║   🌐 http://localhost:${PORT}          ║
    ╚═══════════════════════════════════════╝
  `);
});

export default app;
