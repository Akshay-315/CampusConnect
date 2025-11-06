import { Link, useLocation } from 'react-router-dom';
import { FaBell, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { notificationsAPI } from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotificationCount();
    }
  }, [isAuthenticated]);

  const fetchNotificationCount = async () => {
    try {
      const response = await notificationsAPI.getNotifications({ isRead: false });
      setNotificationCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path
      ? 'text-blue-600 font-semibold'
      : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">🎓</span>
            <span className="text-xl font-bold text-gray-800">CampusConnect</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={isActive('/')}>
              Home
            </Link>
            <Link to="/official" className={isActive('/official')}>
              Official
            </Link>
            <Link to="/student" className={isActive('/student')}>
              Student
            </Link>
            <Link to="/anonymous" className={isActive('/anonymous')}>
              Anonymous
            </Link>
            {user?.role === 'Admin' && (
              <Link to="/admin" className={isActive('/admin')}>
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/notifications"
                  className="relative text-gray-600 hover:text-blue-600"
                >
                  <FaBell className="text-xl" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-blue-600"
                >
                  <FaUser className="text-xl" />
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-xl" />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
              >
                <FaSignInAlt className="text-xl" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
