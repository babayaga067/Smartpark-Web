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

export const parkingService = {
  // Parking Places
  getParkingPlaces: async (params = {}) => {
    const response = await api.get('/parking-places', { params });
    return response;
  },

  getParkingPlace: async (id) => {
    const response = await api.get(`/parking-places/${id}`);
    return response;
  },

  createParkingPlace: async (placeData) => {
    const response = await api.post('/parking-places', placeData);
    return response;
  },

  updateParkingPlace: async (id, placeData) => {
    const response = await api.put(`/parking-places/${id}`, placeData);
    return response;
  },

  deleteParkingPlace: async (id) => {
    const response = await api.delete(`/parking-places/${id}`);
    return response;
  },

  // Parking Slots
  getParkingSlots: async (placeId, params = {}) => {
    const response = await api.get(`/parking-places/${placeId}/slots`, { params });
    return response;
  },

  getParkingSlot: async (id) => {
    const response = await api.get(`/parking-slots/${id}`);
    return response;
  },

  createParkingSlot: async (slotData) => {
    const response = await api.post('/parking-slots', slotData);
    return response;
  },

  updateParkingSlot: async (id, slotData) => {
    const response = await api.put(`/parking-slots/${id}`, slotData);
    return response;
  },

  deleteParkingSlot: async (id) => {
    const response = await api.delete(`/parking-slots/${id}`);
    return response;
  },

  // Bookings
  getUserBookings: async (params = {}) => {
    const response = await api.get('/bookings/user', { params });
    return response;
  },

  getAllBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response;
  },

  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response;
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response;
  },

  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response;
  },

  cancelBooking: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response;
  },

  // Booking Search and Filters
  searchBookings: async (searchParams) => {
    const response = await api.get('/bookings/search', { params: searchParams });
    return response;
  },

  getBookingStats: async (params = {}) => {
    const response = await api.get('/bookings/stats', { params });
    return response;
  },

  // Quick Booking
  quickBook: async (quickBookData) => {
    const response = await api.post('/bookings/quick', quickBookData);
    return response;
  },

  // Payment
  processPayment: async (bookingId, paymentData) => {
    const response = await api.post(`/bookings/${bookingId}/payment`, paymentData);
    return response;
  },

  getPaymentStatus: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}/payment`);
    return response;
  },

  // Notifications
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response;
  },

  markNotificationRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response;
  },

  markAllNotificationsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response;
  },

  // Reports
  getReports: async (params = {}) => {
    const response = await api.get('/reports', { params });
    return response;
  },

  generateReport: async (reportType, params = {}) => {
    const response = await api.post(`/reports/${reportType}`, params);
    return response;
  },

  // Statistics
  getStatistics: async (params = {}) => {
    const response = await api.get('/statistics', { params });
    return response;
  },

  getDashboardStats: async () => {
    const response = await api.get('/statistics/dashboard');
    return response;
  },

  // Real-time updates
  subscribeToUpdates: (bookingId, callback) => {
    // WebSocket implementation would go here
    // For now, we'll use polling
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}`);
        callback(response.data);
      } catch (error) {
        console.error('Error fetching booking updates:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  },

  // File uploads
  uploadImage: async (file, type = 'parking-place') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Export data
  exportBookings: async (format = 'csv', params = {}) => {
    const response = await api.get(`/bookings/export/${format}`, {
      params,
      responseType: 'blob',
    });
    return response;
  },

  exportReport: async (reportType, format = 'pdf', params = {}) => {
    const response = await api.get(`/reports/${reportType}/export/${format}`, {
      params,
      responseType: 'blob',
    });
    return response;
  },

  // Utility functions
  checkAvailability: async (slotId, startTime, endTime) => {
    const response = await api.post('/parking-slots/check-availability', {
      slotId,
      startTime,
      endTime,
    });
    return response;
  },

  calculatePrice: async (slotId, startTime, endTime) => {
    const response = await api.post('/bookings/calculate-price', {
      slotId,
      startTime,
      endTime,
    });
    return response;
  },

  // Admin functions
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response;
  },

  // System health
  getSystemHealth: async () => {
    const response = await api.get('/health');
    return response;
  },

  // Error handling utility
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      switch (status) {
        case 400:
          return `Bad request: ${data.message || 'Invalid data provided'}`;
        case 401:
          return 'Unauthorized: Please log in again';
        case 403:
          return 'Forbidden: You do not have permission to perform this action';
        case 404:
          return 'Not found: The requested resource was not found';
        case 409:
          return `Conflict: ${data.message || 'Resource already exists'}`;
        case 422:
          return `Validation error: ${data.message || 'Invalid input data'}`;
        case 429:
          return 'Too many requests: Please try again later';
        case 500:
          return 'Server error: Please try again later';
        default:
          return `Error ${status}: ${data.message || 'An unexpected error occurred'}`;
      }
    } else if (error.request) {
      // Network error
      return 'Network error: Please check your internet connection';
    } else {
      // Other error
      return error.message || 'An unexpected error occurred';
    }
  },
};

export default parkingService;