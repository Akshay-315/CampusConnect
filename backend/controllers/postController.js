import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';

// @desc    Get all posts by section
// @route   GET /api/posts?section=Official&page=1&limit=10
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const { section, category, tags, page = 1, limit = 10 } = req.query;

    const query = { isDeleted: false };

    if (section) {
      query.section = section;
    }

    if (category) {
      query.category = category;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const posts = await Post.find(query)
      .populate('author', 'name email role department profilePicture')
      .populate('verifiedBy', 'name role')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
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

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email role department profilePicture')
      .populate('verifiedBy', 'name role');

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (for Official) / Public (for Anonymous)
export const createPost = async (req, res) => {
  try {
    const { title, content, section, category, tags, attachments, isAnonymous } = req.body;

    // Validate section-specific rules
    if (section === 'Official' && (!req.user || !['Admin', 'Faculty'].includes(req.user.role))) {
      return res.status(403).json({
        success: false,
        message: 'Only Admin and Faculty can post in Official section',
      });
    }

    const postData = {
      title,
      content,
      section,
      category,
      tags,
      attachments,
      isAnonymous: section === 'Anonymous' || isAnonymous,
    };

    if (section !== 'Anonymous' && req.user) {
      postData.author = req.user._id;
    }

    const post = await Post.create(postData);

    await post.populate('author', 'name email role department profilePicture');

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Author or Admin)
export const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check authorization
    if (
      req.user.role !== 'Admin' &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    const { title, content, category, tags, attachments } = req.body;

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, category, tags, attachments },
      { new: true, runValidators: true }
    ).populate('author', 'name email role department profilePicture');

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Author or Admin)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check authorization
    if (
      req.user.role !== 'Admin' &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    // Soft delete
    post.isDeleted = true;
    await post.save();

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upvote/remove upvote on post
// @route   POST /api/posts/:id/upvote
// @access  Private (optional for anonymous)
export const upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Login required to upvote',
      });
    }

    const upvoteIndex = post.upvotes.indexOf(userId);

    if (upvoteIndex > -1) {
      // Remove upvote
      post.upvotes.splice(upvoteIndex, 1);
      post.upvoteCount = post.upvotes.length;
    } else {
      // Add upvote
      post.upvotes.push(userId);
      post.upvoteCount = post.upvotes.length;

      // Create notification for post author
      if (post.author && post.author.toString() !== userId.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: userId,
          type: 'upvote',
          post: post._id,
          message: `${req.user.name} upvoted your post`,
        });
      }
    }

    await post.save();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify post (Faculty/Admin only)
// @route   PUT /api/posts/:id/verify
// @access  Private (Faculty/Admin)
export const verifyPost = async (req, res) => {
  try {
    const { isVerified, isMisinformation } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    post.isVerified = isVerified;
    post.isMisinformation = isMisinformation || false;
    post.verifiedBy = req.user._id;

    await post.save();
    await post.populate('author', 'name email role department profilePicture');
    await post.populate('verifiedBy', 'name role');

    // Create notification for post author
    if (post.author && isVerified) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'verified',
        post: post._id,
        message: `Your post has been verified by ${req.user.name}`,
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Pin/unpin post (Admin only)
// @route   PUT /api/posts/:id/pin
// @access  Private (Admin)
export const pinPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    post.isPinned = !post.isPinned;
    await post.save();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
