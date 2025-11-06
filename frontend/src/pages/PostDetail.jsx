import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaThumbsUp, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const PostDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        postsAPI.getPost(id),
        commentsAPI.getComments(id),
      ]);
      setPost(postResponse.data.data);
      setComments(commentsResponse.data.data);
    } catch (error) {
      toast.error('Failed to fetch post details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvotePost = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to upvote');
      return;
    }
    try {
      await postsAPI.upvotePost(id);
      fetchPostAndComments();
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await commentsAPI.createComment(id, { 
        content: commentText,
        isAnonymous: post?.section === 'Anonymous' 
      });
      setCommentText('');
      fetchPostAndComments();
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleUpvoteComment = async (commentId) => {
    if (!isAuthenticated) {
      toast.error('Please login to upvote');
      return;
    }
    try {
      await commentsAPI.upvoteComment(commentId);
      fetchPostAndComments();
    } catch (error) {
      toast.error('Failed to upvote comment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-600">Post not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to={`/${post.section.toLowerCase()}`}
        className="flex items-center space-x-2 text-blue-600 hover:underline mb-6"
      >
        <FaArrowLeft />
        <span>Back to {post.section}</span>
      </Link>

      {/* Post Details */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex items-center space-x-2 mb-4">
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
          {post.isVerified && (
            <FaCheckCircle className="text-green-600" title="Verified" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <p className="text-gray-700 mb-6 whitespace-pre-wrap">{post.content}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            {!post.isAnonymous && post.author && (
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{post.author.name}</p>
                  <p className="text-sm text-gray-500">{post.author.role}</p>
                </div>
              </div>
            )}
            {post.isAnonymous && (
              <p className="text-gray-500">Anonymous</p>
            )}
          </div>

          <button
            onClick={handleUpvotePost}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <FaThumbsUp />
            <span>{post.upvoteCount || 0} Upvotes</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Post Comment
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-600 text-center">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="border-b border-gray-200 pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {!comment.isAnonymous && comment.author ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-semibold">
                            {comment.author.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{comment.author.name}</p>
                          <p className="text-xs text-gray-500">{comment.author.role}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500">Anonymous</p>
                    )}
                    {comment.isVerified && (
                      <FaCheckCircle className="text-green-600" title="Verified" />
                    )}
                  </div>
                  <button
                    onClick={() => handleUpvoteComment(comment._id)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <FaThumbsUp className="text-sm" />
                    <span className="text-sm">{comment.upvoteCount || 0}</span>
                  </button>
                </div>
                <p className="text-gray-700 ml-10">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
