import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl);

    newSocket.on('connect', () => {
      console.log('Socket connected');
      if (user) {
        newSocket.emit('join', user._id);
      }
    });

    newSocket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    newSocket.on('newPost', (post) => {
      // Handle new post notification
      console.log('New post:', post);
    });

    newSocket.on('newComment', ({ postId, comment }) => {
      // Handle new comment notification
      console.log('New comment on post:', postId, comment);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const sendNotification = (recipientId, notification) => {
    if (socket) {
      socket.emit('notification', { recipientId, notification });
    }
  };

  const broadcastNewPost = (post) => {
    if (socket) {
      socket.emit('newPost', post);
    }
  };

  const broadcastNewComment = (postId, comment) => {
    if (socket) {
      socket.emit('newComment', { postId, comment });
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    socket,
    notifications,
    sendNotification,
    broadcastNewPost,
    broadcastNewComment,
    clearNotifications,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
