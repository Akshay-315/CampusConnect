# CampusConnect 🎓

A smart, minimalistic college forum platform designed for efficiency and privacy within one institution. CampusConnect provides a single web space for official notices, student discussions, and anonymous expression.

![CampusConnect](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![React](https://img.shields.io/badge/React-v18+-blue.svg)

## 🌟 Features

### Three Main Sections

1. **Official Section** 📢
   - Faculty/Admin can post official notices
   - Notices about exams, events, placements
   - Students can react and comment
   - Verified posts system

2. **Student Section** 💬
   - Students can post threads/questions
   - Categories: Academics, Clubs, Lost & Found, Placements
   - Peer support and discussions
   - Faculty can verify answers

3. **Anonymous Section** 🎭
   - Post without revealing identity
   - No login required
   - Community moderation
   - Safe space for expression

### Core Features

- 🔐 **JWT-based Authentication** with role-based access (Admin, Faculty, Student)
- 🔔 **Real-time Notifications** using Socket.io
- 👍 **Upvotes & Comments** on posts
- ✅ **Verification System** for reliable information
- 📌 **Pin Important Posts** (Admin only)
- 🏷️ **Tags & Categories** for easy discovery
- 📱 **Responsive Design** with TailwindCSS
- 🛡️ **Moderation Tools** for admins

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **Socket.io-client** - Real-time features
- **React Toastify** - Notifications

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Akshay-315/CampusConnect.git
cd CampusConnect
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# Example:
# MONGODB_URI=mongodb://localhost:27017/campusconnect
# JWT_SECRET=your_secret_key_here

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional - defaults are set)
cp .env.example .env

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 👤 Demo Credentials

After running the seed script, you can login with:

### Admin
- Email: `admin@college.edu`
- Password: `admin123`

### Faculty
- Email: `sarah.johnson@college.edu`
- Password: `faculty123`

### Student
- Email: `john.doe@college.edu`
- Password: `student123`

## 📁 Project Structure

```
CampusConnect/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication & error handling
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── server.js        # Express server with Socket.io
│   ├── seed.js          # Database seeding script
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React Context (Auth, Socket)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── App.jsx      # Main app component
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Global styles
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/upvote` - Upvote post
- `PUT /api/posts/:id/verify` - Verify post (Faculty/Admin)
- `PUT /api/posts/:id/pin` - Pin post (Admin)

### Comments
- `GET /api/comments/:postId` - Get comments for post
- `POST /api/comments/:postId` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/upvote` - Upvote comment

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/posts` - Get all posts

## 🎨 Features Breakdown

### Role-Based Access Control

| Feature | Student | Faculty | Admin |
|---------|---------|---------|-------|
| View all posts | ✅ | ✅ | ✅ |
| Post in Student section | ✅ | ✅ | ✅ |
| Post in Official section | ❌ | ✅ | ✅ |
| Verify posts | ❌ | ✅ | ✅ |
| Pin posts | ❌ | ❌ | ✅ |
| Delete any post | ❌ | ❌ | ✅ |
| Admin dashboard | ❌ | ❌ | ✅ |

### Anonymous Posting
- No authentication required
- Complete anonymity
- Can comment anonymously
- No upvote tracking for anonymous users

## 🔧 Development Scripts

### Backend
```bash
npm start       # Start server
npm run dev     # Start with nodemon
npm run seed    # Seed database
```

### Frontend
```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## 🌐 Deployment

### Backend (Render/Heroku)
1. Set environment variables
2. Connect MongoDB Atlas
3. Deploy from GitHub

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables

## 🔮 Future Enhancements

- [ ] AI-based summarizer for long notices
- [ ] Smart tag suggestions
- [ ] Toxic comment filter
- [ ] Sentiment analyzer for anonymous posts
- [ ] File upload support (PDFs, images)
- [ ] Search functionality
- [ ] Email notifications
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Akshay-315**
- GitHub: [@Akshay-315](https://github.com/Akshay-315)

## 🙏 Acknowledgments

- Built with ❤️ for college communities
- Inspired by the need for better campus communication
- Thanks to all contributors

## 📞 Support

For support, email akshay@example.com or open an issue on GitHub.

---

**Happy Connecting! 🎓**