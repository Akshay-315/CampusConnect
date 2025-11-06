import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const comments = await Comment.find({ 
      post: postId, 
      isDeleted: false 
    })
      .populate('author', 'name email role department profilePicture')
      .populate('verifiedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Comment.countDocuments({ 
      post: postId, 
      isDeleted: false 
    });

    res.json({
      success: true,
      data: comments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create comment
// @route   POST /api/comments/:postId
// @access  Private (optional for anonymous)
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, isAnonymous } = req.body;

    const post = await Post.findById(postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const commentData = {
      post: postId,
      content,
      isAnonymous: post.section === 'Anonymous' || isAnonymous,
    };

    if (!isAnonymous && req.user) {
      commentData.author = req.user._id;
    }

    const comment = await Comment.create(commentData);

    // Update post comment count
    post.commentCount = await Comment.countDocuments({ 
      post: postId, 
      isDeleted: false 
    });
    await post.save();

    await comment.populate('author', 'name email role department profilePicture');

    // Create notification for post author
    if (post.author && req.user && post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        post: postId,
        comment: comment._id,
        message: `${req.user.name} commented on your post`,
      });
    }

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private (Author or Admin)
export const updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check authorization
    if (
      req.user.role !== 'Admin' &&
      comment.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment',
      });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    await comment.populate('author', 'name email role department profilePicture');

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Author or Admin)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check authorization
    if (
      req.user.role !== 'Admin' &&
      comment.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    // Soft delete
    comment.isDeleted = true;
    await comment.save();

    // Update post comment count
    const post = await Post.findById(comment.post);
    if (post) {
      post.commentCount = await Comment.countDocuments({ 
        post: comment.post, 
        isDeleted: false 
      });
      await post.save();
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upvote/remove upvote on comment
// @route   POST /api/comments/:id/upvote
// @access  Private
export const upvoteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    const userId = req.user._id;
    const upvoteIndex = comment.upvotes.indexOf(userId);

    if (upvoteIndex > -1) {
      // Remove upvote
      comment.upvotes.splice(upvoteIndex, 1);
      comment.upvoteCount = comment.upvotes.length;
    } else {
      // Add upvote
      comment.upvotes.push(userId);
      comment.upvoteCount = comment.upvotes.length;
    }

    await comment.save();

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify comment (Faculty/Admin only)
// @route   PUT /api/comments/:id/verify
// @access  Private (Faculty/Admin)
export const verifyComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    comment.isVerified = !comment.isVerified;
    comment.verifiedBy = comment.isVerified ? req.user._id : null;

    await comment.save();
    await comment.populate('author', 'name email role department profilePicture');
    await comment.populate('verifiedBy', 'name role');

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
