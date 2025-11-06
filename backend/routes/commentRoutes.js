import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  upvoteComment,
  verifyComment,
} from '../controllers/commentController.js';
import { protect, optionalAuth, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/:postId')
  .get(getComments)
  .post(optionalAuth, createComment);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.post('/:id/upvote', protect, upvoteComment);
router.put('/:id/verify', protect, authorize('Admin', 'Faculty'), verifyComment);

export default router;
