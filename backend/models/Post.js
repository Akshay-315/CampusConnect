import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    section: {
      type: String,
      enum: ['Official', 'Student', 'Anonymous'],
      required: true,
    },
    category: {
      type: String,
      enum: ['Events', 'Exams', 'Placements', 'Academics', 'Clubs', 'Lost & Found', 'General', 'Other'],
      default: 'General',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function() {
        return this.section !== 'Anonymous';
      },
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        url: String,
        type: {
          type: String,
          enum: ['image', 'pdf', 'document'],
        },
        filename: String,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    upvoteCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isMisinformation: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
postSchema.index({ section: 1, createdAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ category: 1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
