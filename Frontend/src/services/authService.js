import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Authentication
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Token refresh failed');
    }
  },

  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw new Error('Token verification failed');
    }
  },

  // Password Management
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  },

  // Profile Management
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  updateAvatar: async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await api.put('/auth/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update avatar');
    }
  },

  deleteAccount: async (password) => {
    try {
      const response = await api.delete('/auth/profile', { data: { password } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
  },

  // Email Verification
  sendVerificationEmail: async () => {
    try {
      const response = await api.post('/auth/send-verification');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send verification email');
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    }
  },

  // Two-Factor Authentication
  enable2FA: async () => {
    try {
      const response = await api.post('/auth/2fa/enable');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to enable 2FA');
    }
  },

  disable2FA: async (code) => {
    try {
      const response = await api.post('/auth/2fa/disable', { code });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to disable 2FA');
    }
  },

  verify2FA: async (code) => {
    try {
      const response = await api.post('/auth/2fa/verify', { code });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '2FA verification failed');
    }
  },

  // Session Management
  getSessions: async () => {
    try {
      const response = await api.get('/auth/sessions');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sessions');
    }
  },

  revokeSession: async (sessionId) => {
    try {
      const response = await api.delete(`/auth/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to revoke session');
    }
  },

  revokeAllSessions: async () => {
    try {
      const response = await api.delete('/auth/sessions');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to revoke all sessions');
    }
  },

  // Social Authentication
  googleAuth: async (token) => {
    try {
      const response = await api.post('/auth/google', { token });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Google authentication failed');
    }
  },

  facebookAuth: async (token) => {
    try {
      const response = await api.post('/auth/facebook', { token });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Facebook authentication failed');
    }
  },

  // Admin Functions
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/auth/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/auth/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user role');
    }
  },

  suspendUser: async (userId, reason) => {
    try {
      const response = await api.post(`/auth/users/${userId}/suspend`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to suspend user');
    }
  },

  unsuspendUser: async (userId) => {
    try {
      const response = await api.post(`/auth/users/${userId}/unsuspend`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unsuspend user');
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  // Security
  getLoginHistory: async () => {
    try {
      const response = await api.get('/auth/login-history');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch login history');
    }
  },

  getSecurityLogs: async () => {
    try {
      const response = await api.get('/auth/security-logs');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch security logs');
    }
  },

  // Utility Functions
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  getTokenExpiration: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Error handling utility
  handleAuthError: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          return `Bad request: ${data.message || 'Invalid credentials'}`;
        case 401:
          return 'Unauthorized: Please check your credentials';
        case 403:
          return 'Forbidden: Your account may be suspended';
        case 404:
          return 'User not found';
        case 409:
          return `Conflict: ${data.message || 'User already exists'}`;
        case 422:
          return `Validation error: ${data.message || 'Invalid input data'}`;
        case 429:
          return 'Too many attempts: Please try again later';
        case 500:
          return 'Server error: Please try again later';
        default:
          return `Error ${status}: ${data.message || 'Authentication failed'}`;
      }
    } else if (error.request) {
      return 'Network error: Please check your internet connection';
    } else {
      return error.message || 'Authentication failed';
    }
  },

  // Validation utilities
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  validatePhone: (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  // Password strength checker
  getPasswordStrength: (password) => {
    let strength = 0;
    const feedback = [];

    if (password.length >= 8) strength += 1;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(password)) strength += 1;
    else feedback.push('Include lowercase letter');

    if (/[A-Z]/.test(password)) strength += 1;
    else feedback.push('Include uppercase letter');

    if (/\d/.test(password)) strength += 1;
    else feedback.push('Include number');

    if (/[@$!%*?&]/.test(password)) strength += 1;
    else feedback.push('Include special character');

    let strengthText = '';
    if (strength <= 2) strengthText = 'Weak';
    else if (strength <= 3) strengthText = 'Fair';
    else if (strength <= 4) strengthText = 'Good';
    else strengthText = 'Strong';

    return {
      score: strength,
      text: strengthText,
      feedback: feedback
    };
  }
};

export default authService;