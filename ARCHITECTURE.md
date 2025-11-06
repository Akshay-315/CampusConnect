# CampusConnect - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│                    http://localhost:5173                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Pages      │  │  Components  │  │   Context    │        │
│  │              │  │              │  │              │        │
│  │ • Home       │  │ • Navbar     │  │ • Auth       │        │
│  │ • Login      │  │ • PostCard   │  │ • Socket     │        │
│  │ • Register   │  │ • CreatePost │  │              │        │
│  │ • Official   │  │ • Layout     │  └──────────────┘        │
│  │ • Student    │  │              │                           │
│  │ • Anonymous  │  └──────────────┘                           │
│  │ • Profile    │                                             │
│  │ • Notifs     │  ┌──────────────┐                           │
│  │ • Admin      │  │  Services    │                           │
│  │ • PostDetail │  │              │                           │
│  └──────────────┘  │ • API (Axios)│                           │
│                    └──────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ HTTP/REST + WebSocket
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                  │
│                    http://localhost:5000                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Routes     │  │ Controllers  │  │  Middleware  │        │
│  │              │  │              │  │              │        │
│  │ • Auth       │  │ • Auth       │  │ • JWT Auth   │        │
│  │ • Posts      │  │ • Posts      │  │ • Error      │        │
│  │ • Comments   │  │ • Comments   │  │ • Validate   │        │
│  │ • Notifs     │  │ • Notifs     │  │              │        │
│  │ • Admin      │  │ • Admin      │  └──────────────┘        │
│  └──────────────┘  └──────────────┘                           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │   Models     │  │  Socket.io   │                           │
│  │              │  │              │                           │
│  │ • User       │  │ • Real-time  │                           │
│  │ • Post       │  │ • Notifs     │                           │
│  │ • Comment    │  │ • Events     │                           │
│  │ • Notify     │  │              │                           │
│  └──────────────┘  └──────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ Mongoose
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                          │
│                  mongodb://localhost:27017                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ users        │  │ posts        │  │ comments     │        │
│  │ collection   │  │ collection   │  │ collection   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐                                              │
│  │notifications │                                              │
│  │ collection   │                                              │
│  └──────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. User Registration/Login Flow
```
User → Frontend (Login Page)
  ↓
Frontend sends credentials → Backend (Auth Controller)
  ↓
Backend validates → Check Database
  ↓
Generate JWT Token ← User found
  ↓
Return Token + User Data → Frontend
  ↓
Store in localStorage + Context → User logged in
```

### 2. Creating a Post Flow
```
User → Frontend (Create Post Form)
  ↓
Submit Post Data → Backend (Post Controller)
  ↓
Check User Role/Auth → Middleware
  ↓
Validate Section Rules → Controller Logic
  ↓
Save to Database → MongoDB posts collection
  ↓
Broadcast via Socket.io → All connected clients
  ↓
Return Post Data → Frontend
  ↓
Update UI → Show new post
```

### 3. Real-time Notification Flow
```
User A comments on User B's post
  ↓
Backend creates comment → Save to DB
  ↓
Check post author → User B
  ↓
Create notification → Save to DB
  ↓
Emit via Socket.io → User B's socket connection
  ↓
Frontend receives event → Update notification count
  ↓
Show toast notification → User B sees it
```

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum['Admin', 'Faculty', 'Student'],
  department: String,
  year: Number,
  profilePicture: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Posts Collection
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  section: Enum['Official', 'Student', 'Anonymous'],
  category: String,
  author: ObjectId (ref: User),
  isAnonymous: Boolean,
  attachments: Array,
  tags: [String],
  upvotes: [ObjectId],
  upvoteCount: Number,
  commentCount: Number,
  isVerified: Boolean,
  isMisinformation: Boolean,
  verifiedBy: ObjectId (ref: User),
  isPinned: Boolean,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Comments Collection
```javascript
{
  _id: ObjectId,
  post: ObjectId (ref: Post),
  author: ObjectId (ref: User),
  content: String,
  isAnonymous: Boolean,
  isVerified: Boolean,
  verifiedBy: ObjectId (ref: User),
  upvotes: [ObjectId],
  upvoteCount: Number,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  recipient: ObjectId (ref: User),
  sender: ObjectId (ref: User),
  type: Enum['comment', 'upvote', 'verified', 'reply', 'mention'],
  post: ObjectId (ref: Post),
  comment: ObjectId (ref: Comment),
  message: String,
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

```
┌──────────────┐
│ User Request │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ JWT Middleware   │
│ • Verify Token   │
│ • Extract User   │
└──────┬───────────┘
       │
       ├── Valid Token ──────┐
       │                     ▼
       │            ┌────────────────┐
       │            │ Role Check     │
       │            │ • Admin?       │
       │            │ • Faculty?     │
       │            │ • Student?     │
       │            └────────┬───────┘
       │                     │
       │                     ▼
       │            ┌────────────────┐
       │            │ Access Granted │
       │            │ Process Request│
       │            └────────────────┘
       │
       └── Invalid Token ───┐
                            ▼
                   ┌────────────────┐
                   │ 401 Unauthorized│
                   └────────────────┘
```

## 🎯 Section Access Control

```
╔═══════════════╦═════════╦═════════╦═════════╗
║   Action      ║ Student ║ Faculty ║  Admin  ║
╠═══════════════╬═════════╬═════════╬═════════╣
║ View Posts    ║    ✓    ║    ✓    ║    ✓    ║
║ Post Official ║    ✗    ║    ✓    ║    ✓    ║
║ Post Student  ║    ✓    ║    ✓    ║    ✓    ║
║ Post Anon     ║    ✓    ║    ✓    ║    ✓    ║
║ Verify Post   ║    ✗    ║    ✓    ║    ✓    ║
║ Pin Post      ║    ✗    ║    ✗    ║    ✓    ║
║ Delete Any    ║    ✗    ║    ✗    ║    ✓    ║
║ Admin Panel   ║    ✗    ║    ✗    ║    ✓    ║
╚═══════════════╩═════════╩═════════╩═════════╝
```

## 🌐 API Endpoints Summary

### Authentication (`/api/auth`)
- POST `/register` - Register new user
- POST `/login` - Login user
- GET `/me` - Get current user
- PUT `/profile` - Update profile

### Posts (`/api/posts`)
- GET `/` - Get all posts (with filters)
- GET `/:id` - Get single post
- POST `/` - Create post
- PUT `/:id` - Update post
- DELETE `/:id` - Delete post
- POST `/:id/upvote` - Toggle upvote
- PUT `/:id/verify` - Verify post (Faculty/Admin)
- PUT `/:id/pin` - Pin post (Admin)

### Comments (`/api/comments`)
- GET `/:postId` - Get comments
- POST `/:postId` - Create comment
- PUT `/:id` - Update comment
- DELETE `/:id` - Delete comment
- POST `/:id/upvote` - Toggle upvote
- PUT `/:id/verify` - Verify comment (Faculty/Admin)

### Notifications (`/api/notifications`)
- GET `/` - Get notifications
- PUT `/:id/read` - Mark as read
- PUT `/read-all` - Mark all as read
- DELETE `/:id` - Delete notification

### Admin (`/api/admin`)
- GET `/users` - Get all users
- PUT `/users/:id` - Update user
- DELETE `/users/:id` - Delete user
- GET `/stats` - Get statistics
- GET `/posts` - Get all posts

## 🔌 Socket.io Events

### Client → Server
```javascript
socket.emit('join', userId);           // User joins
socket.emit('notification', data);     // Send notification
socket.emit('newPost', postData);      // New post created
socket.emit('newComment', data);       // New comment added
```

### Server → Client
```javascript
socket.on('notification', notification); // Receive notification
socket.on('newPost', post);              // Receive new post
socket.on('newComment', comment);        // Receive new comment
```

## 🎨 Component Hierarchy

```
App
├── AuthProvider
│   └── SocketProvider
│       └── Router
│           └── Layout
│               ├── Navbar
│               └── Routes
│                   ├── Home
│                   ├── Login
│                   ├── Register
│                   ├── Official
│                   │   ├── CreatePost
│                   │   └── PostCard (multiple)
│                   ├── Student
│                   │   ├── CreatePost
│                   │   └── PostCard (multiple)
│                   ├── Anonymous
│                   │   ├── CreatePost
│                   │   └── PostCard (multiple)
│                   ├── PostDetail
│                   │   └── Comments
│                   ├── Profile
│                   ├── Notifications
│                   └── AdminDashboard
```

## 🚀 Deployment Architecture

```
┌─────────────────┐
│   Vercel CDN    │  Frontend (React)
│   (Frontend)    │  • Global CDN
│                 │  • Auto SSL
└────────┬────────┘  • Auto Deploy
         │
         │ HTTPS
         ▼
┌─────────────────┐
│  Render/Railway │  Backend (Node.js)
│   (Backend)     │  • REST API
│                 │  • WebSocket
└────────┬────────┘  • Auto Scale
         │
         │ MongoDB Driver
         ▼
┌─────────────────┐
│ MongoDB Atlas   │  Database
│  (Database)     │  • Cloud DB
│                 │  • Auto Backup
└─────────────────┘  • Monitoring
```

## 📦 Project Structure

```
CampusConnect/
├── backend/
│   ├── config/          # DB config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── server.js        # Express + Socket.io
│   ├── seed.js          # Sample data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # State management
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API calls
│   │   ├── App.jsx      # Main component
│   │   └── main.jsx     # Entry point
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── README.md            # Main documentation
├── QUICK_START.md       # Setup guide
├── FEATURES.md          # Feature list
├── DEPLOYMENT.md        # Deploy guide
└── ARCHITECTURE.md      # This file
```

---

This architecture ensures:
- ✅ Scalability
- ✅ Maintainability
- ✅ Security
- ✅ Real-time capability
- ✅ Clear separation of concerns
