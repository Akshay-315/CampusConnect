import { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { toast } from 'react-toastify';

const Official = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getPosts({ section: 'Official', page, limit: 10 });
      setPosts(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📢 Official Section</h1>
        <p className="text-gray-600">
          Official notices, announcements, and updates from faculty and administration
        </p>
      </div>

      <CreatePost section="Official" onPostCreated={handlePostCreated} />

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No posts yet. Be the first to post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Official;
