import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Posts API
export const postsAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  upvotePost: (id) => api.post(`/posts/${id}/upvote`),
  verifyPost: (id, data) => api.put(`/posts/${id}/verify`, data),
  pinPost: (id) => api.put(`/posts/${id}/pin`),
};

// Comments API
export const commentsAPI = {
  getComments: (postId, params) => api.get(`/comments/${postId}`, { params }),
  createComment: (postId, data) => api.post(`/comments/${postId}`, data),
  updateComment: (id, data) => api.put(`/comments/${id}`, data),
  deleteComment: (id) => api.delete(`/comments/${id}`),
  upvoteComment: (id) => api.post(`/comments/${id}/upvote`),
  verifyComment: (id) => api.put(`/comments/${id}/verify`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Admin API
export const adminAPI = {
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get('/admin/stats'),
  getAllPosts: (params) => api.get('/admin/posts', { params }),
};

export default api;
