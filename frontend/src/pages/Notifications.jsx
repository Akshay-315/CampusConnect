import { useState, useEffect } from 'react';
import { notificationsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getNotifications();
      setNotifications(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                !notification.isRead ? 'border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-gray-800 mb-2">{notification.message}</p>
                  {notification.post && (
                    <Link
                      to={`/post/${notification.post._id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Post: {notification.post.title}
                    </Link>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="text-sm text-blue-600 hover:underline ml-4"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
