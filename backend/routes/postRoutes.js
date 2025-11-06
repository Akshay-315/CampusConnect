import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  upvotePost,
  verifyPost,
  pinPost,
} from '../controllers/postController.js';
import { protect, optionalAuth, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(optionalAuth, getPosts)
  .post(optionalAuth, createPost);

router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.post('/:id/upvote', protect, upvotePost);
router.put('/:id/verify', protect, authorize('Admin', 'Faculty'), verifyPost);
router.put('/:id/pin', protect, authorize('Admin'), pinPost);

export default router;
