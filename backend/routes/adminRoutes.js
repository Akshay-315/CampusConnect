import express from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getStats,
  getAllPosts,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply admin authorization to all routes
router.use(protect);
router.use(authorize('Admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);
router.get('/posts', getAllPosts);

export default router;
