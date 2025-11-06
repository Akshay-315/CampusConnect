import { FaThumbsUp, FaComment, FaCheckCircle, FaExclamationTriangle, FaPin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useState } from 'react';

const PostCard = ({ post, onUpdate }) => {
  const { user, isAuthenticated, isAdmin, isFaculty } = useAuth();
  const [isUpvoted, setIsUpvoted] = useState(
    post.upvotes?.includes(user?._id) || false
  );
  const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount || 0);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to upvote');
      return;
    }

    try {
      await postsAPI.upvotePost(post._id);
      setIsUpvoted(!isUpvoted);
      setUpvoteCount(isUpvoted ? upvoteCount - 1 : upvoteCount + 1);
      toast.success(isUpvoted ? 'Upvote removed' : 'Post upvoted!');
    } catch (error) {
      toast.error('Failed to upvote post');
    }
  };

  const handleVerify = async () => {
    try {
      await postsAPI.verifyPost(post._id, { isVerified: !post.isVerified });
      toast.success(post.isVerified ? 'Verification removed' : 'Post verified!');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to verify post');
    }
  };

  const handlePin = async () => {
    try {
      await postsAPI.pinPost(post._id);
      toast.success(post.isPinned ? 'Post unpinned' : 'Post pinned!');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to pin post');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(post._id);
        toast.success('Post deleted successfully');
        if (onUpdate) onUpdate();
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canEdit = user && (user._id === post.author?._id || isAdmin);
  const canVerify = (isAdmin || isFaculty) && post.section !== 'Anonymous';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-3 py-1 text-xs rounded-full ${
              post.section === 'Official' ? 'bg-blue-100 text-blue-800' :
              post.section === 'Student' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {post.section}
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
              {post.category}
            </span>
            {post.isPinned && (
              <FaPin className="text-blue-600" title="Pinned" />
            )}
            {post.isVerified && (
              <FaCheckCircle className="text-green-600" title="Verified" />
            )}
            {post.isMisinformation && (
              <FaExclamationTriangle className="text-red-600" title="Misinformation" />
            )}
          </div>
          <Link to={`/post/${post._id}`}>
            <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 mb-2">
              {post.title}
            </h2>
          </Link>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
        </div>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Author */}
          {!post.isAnonymous && post.author && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {post.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{post.author.name}</p>
                <p className="text-xs text-gray-500">{post.author.role}</p>
              </div>
            </div>
          )}
          {post.isAnonymous && (
            <p className="text-sm text-gray-500">Anonymous</p>
          )}
          <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Upvote */}
          <button
            onClick={handleUpvote}
            className={`flex items-center space-x-1 ${
              isUpvoted ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <FaThumbsUp />
            <span className="text-sm">{upvoteCount}</span>
          </button>

          {/* Comments */}
          <Link
            to={`/post/${post._id}`}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
          >
            <FaComment />
            <span className="text-sm">{post.commentCount || 0}</span>
          </Link>

          {/* Admin/Faculty Actions */}
          {canVerify && (
            <button
              onClick={handleVerify}
              className={`text-sm ${
                post.isVerified ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
              }`}
            >
              Verify
            </button>
          )}

          {isAdmin && (
            <>
              <button
                onClick={handlePin}
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                {post.isPinned ? 'Unpin' : 'Pin'}
              </button>
            </>
          )}

          {canEdit && (
            <button
              onClick={handleDelete}
              className="text-sm text-gray-500 hover:text-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
