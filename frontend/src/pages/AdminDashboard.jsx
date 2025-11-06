import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, postsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers({ limit: 10 }),
        adminAPI.getAllPosts({ limit: 10 }),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setPosts(postsRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await adminAPI.updateUser(userId, { isActive: !isActive });
      toast.success('User status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-600">Access denied. Admin only.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-2 px-4 ${
            activeTab === 'stats'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-4 ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-2 px-4 ${
            activeTab === 'posts'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Posts
        </button>
      </div>

      {/* Statistics Tab */}
      {activeTab === 'stats' && stats && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Posts</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalPosts}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Comments</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalComments}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by Role</h3>
              <div className="space-y-2">
                {stats.usersByRole.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
                    <span className="text-gray-700">{item._id}</span>
                    <span className="font-semibold text-gray-800">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Posts by Section</h3>
              <div className="space-y-2">
                {stats.postsBySection.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
                    <span className="text-gray-700">{item._id}</span>
                    <span className="font-semibold text-gray-800">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                      className="text-blue-600 hover:underline"
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post._id}>
                  <td className="px-6 py-4">
                    <Link to={`/post/${post._id}`} className="text-blue-600 hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.isAnonymous ? 'Anonymous' : post.author?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/post/${post._id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
