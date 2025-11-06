import { useState } from 'react';
import { postsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const CreatePost = ({ section, onPostCreated }) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  const categories = {
    Official: ['Events', 'Exams', 'Placements', 'General'],
    Student: ['Academics', 'Clubs', 'Lost & Found', 'Placements', 'General'],
    Anonymous: ['General', 'Other'],
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if user can post in Official section
    if (section === 'Official' && (!isAuthenticated || !['Admin', 'Faculty'].includes(user?.role))) {
      toast.error('Only Admin and Faculty can post in Official section');
      return;
    }

    setLoading(true);

    try {
      const postData = {
        ...formData,
        section,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isAnonymous: section === 'Anonymous',
      };

      const response = await postsAPI.createPost(postData);
      toast.success('Post created successfully!');
      setFormData({ title: '', content: '', category: 'General', tags: '' });
      if (onPostCreated) {
        onPostCreated(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  // For Official section, require authentication
  if (section === 'Official' && (!isAuthenticated || !['Admin', 'Faculty'].includes(user?.role))) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Create New Post
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Post Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="What's on your mind?"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories[section]?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
