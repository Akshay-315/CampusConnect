import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';
import connectDB from './config/db.js';

dotenv.config();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'Admin',
    department: 'Administration',
  },
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@college.edu',
    password: 'faculty123',
    role: 'Faculty',
    department: 'Computer Science',
  },
  {
    name: 'John Doe',
    email: 'john.doe@college.edu',
    password: 'student123',
    role: 'Student',
    department: 'Computer Science',
    year: 3,
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@college.edu',
    password: 'student123',
    role: 'Student',
    department: 'Electronics',
    year: 2,
  },
  {
    name: 'Mike Wilson',
    email: 'mike.wilson@college.edu',
    password: 'student123',
    role: 'Student',
    department: 'Computer Science',
    year: 4,
  },
];

const posts = [
  {
    title: 'Important: Mid-Semester Exam Schedule Released',
    content: 'The mid-semester examination schedule has been released. Please check your respective department notice boards and the college website for detailed timetables. Exams will commence from November 20th, 2025.',
    section: 'Official',
    category: 'Exams',
    tags: ['exams', 'schedule', 'important'],
    isPinned: true,
  },
  {
    title: 'Campus Placement Drive - Tech Giants',
    content: 'Multiple tech companies including Google, Microsoft, and Amazon will be conducting placement drives on campus next month. Eligible students are requested to register through the placement portal.',
    section: 'Official',
    category: 'Placements',
    tags: ['placements', 'jobs', 'tech'],
    isPinned: true,
  },
  {
    title: 'Annual Tech Fest - Registration Open',
    content: 'Our annual tech fest "TechNova 2025" is scheduled for December. Registration is now open for various technical and non-technical events. Win exciting prizes!',
    section: 'Official',
    category: 'Events',
    tags: ['fest', 'events', 'techfest'],
  },
  {
    title: 'Data Structures Assignment Help',
    content: 'Can someone explain the concept of Red-Black Trees? I\'m stuck on the assignment and the lecture notes are not very clear.',
    section: 'Student',
    category: 'Academics',
    tags: ['help', 'data-structures', 'assignment'],
  },
  {
    title: 'Lost: Blue Water Bottle',
    content: 'Lost my blue Cello water bottle near the library yesterday. It has my name written on it. Please contact if found.',
    section: 'Student',
    category: 'Lost & Found',
    tags: ['lost', 'library'],
  },
  {
    title: 'Coding Club Meeting This Saturday',
    content: 'Coding Club is organizing a workshop on Web Development this Saturday at 10 AM in Lab 3. All are welcome! Topics: React, Node.js, and MongoDB.',
    section: 'Student',
    category: 'Clubs',
    tags: ['coding-club', 'workshop', 'web-dev'],
  },
  {
    title: 'Is the food quality in the canteen getting worse?',
    content: 'Just wanted to share that the food quality in the main canteen has significantly decreased over the past few weeks. Anyone else noticed this?',
    section: 'Anonymous',
    category: 'General',
    tags: ['canteen', 'food'],
    isAnonymous: true,
  },
  {
    title: 'Feeling stressed about placements',
    content: 'With placement season approaching, I\'m feeling extremely anxious. The competition is tough and I\'m not sure if I\'m prepared enough. How are you all coping?',
    section: 'Anonymous',
    category: 'General',
    tags: ['mental-health', 'placements', 'stress'],
    isAnonymous: true,
  },
];

const comments = [
  {
    content: 'Thanks for sharing! This is really helpful.',
  },
  {
    content: 'Will there be any changes in the exam pattern this year?',
  },
  {
    content: 'I can help you with Red-Black Trees. Let me know when you\'re free.',
  },
  {
    content: 'Same here! The canteen quality needs serious improvement.',
    isAnonymous: true,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Assign authors to posts
    const postsWithAuthors = posts.map((post, index) => {
      if (post.section === 'Official') {
        // Official posts by admin or faculty
        post.author = index % 2 === 0 ? createdUsers[0]._id : createdUsers[1]._id;
      } else if (post.section === 'Student') {
        // Student posts by students
        post.author = createdUsers[2 + (index % 3)]._id;
      } else {
        // Anonymous posts don't need author
        delete post.author;
      }
      return post;
    });

    // Create posts
    console.log('📝 Creating posts...');
    const createdPosts = await Post.create(postsWithAuthors);
    console.log(`✅ Created ${createdPosts.length} posts`);

    // Assign comments to posts
    const commentsWithDetails = comments.map((comment, index) => {
      comment.post = createdPosts[index % createdPosts.length]._id;
      if (!comment.isAnonymous) {
        comment.author = createdUsers[2 + (index % 3)]._id;
      }
      return comment;
    });

    // Create comments
    console.log('💬 Creating comments...');
    const createdComments = await Comment.create(commentsWithDetails);
    console.log(`✅ Created ${createdComments.length} comments`);

    // Update comment counts
    for (const post of createdPosts) {
      post.commentCount = await Comment.countDocuments({ post: post._id });
      await post.save();
    }

    console.log(`
    ╔════════════════════════════════════════════╗
    ║   ✅ Database seeded successfully!        ║
    ╚════════════════════════════════════════════╝

    📧 Login Credentials:
    
    Admin:
      Email: admin@college.edu
      Password: admin123
    
    Faculty:
      Email: sarah.johnson@college.edu
      Password: faculty123
    
    Student:
      Email: john.doe@college.edu
      Password: student123
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
