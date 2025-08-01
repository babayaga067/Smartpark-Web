import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service class
class ApiService {
  // Auth endpoints
  static async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  static async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  static async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  static async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  static async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  }

  // Parking places endpoints
  static async getParkingPlaces(params = {}) {
    const response = await api.get('/parking-places', { params });
    return response.data;
  }

  static async getParkingPlace(id) {
    const response = await api.get(`/parking-places/${id}`);
    return response.data;
  }

  static async createParkingPlace(placeData) {
    const response = await api.post('/parking-places', placeData);
    return response.data;
  }

  static async updateParkingPlace(id, placeData) {
    const response = await api.put(`/parking-places/${id}`, placeData);
    return response.data;
  }

  static async deleteParkingPlace(id) {
    const response = await api.delete(`/parking-places/${id}`);
    return response.data;
  }

  // Parking slots endpoints
  static async getParkingSlots(params = {}) {
    const response = await api.get('/parking-slots', { params });
    return response.data;
  }

  static async getParkingSlot(id) {
    const response = await api.get(`/parking-slots/${id}`);
    return response.data;
  }

  static async createParkingSlot(slotData) {
    const response = await api.post('/parking-slots', slotData);
    return response.data;
  }

  static async updateParkingSlot(id, slotData) {
    const response = await api.put(`/parking-slots/${id}`, slotData);
    return response.data;
  }

  static async deleteParkingSlot(id) {
    const response = await api.delete(`/parking-slots/${id}`);
    return response.data;
  }

  // Booking endpoints
  static async getBookings(params = {}) {
    const response = await api.get('/bookings', { params });
    return response.data;
  }

  static async getBooking(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  }

  static async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  }

  static async updateBooking(id, bookingData) {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  }

  static async cancelBooking(id) {
    const response = await api.post(`/bookings/${id}/cancel`);
    return response.data;
  }

  static async deleteBooking(id) {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }

  // User bookings
  static async getUserBookings(params = {}) {
    const response = await api.get('/bookings/user', { params });
    return response.data;
  }

  // Admin endpoints
  static async getAllBookings(params = {}) {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  }

  static async getBookingStats() {
    const response = await api.get('/admin/bookings/stats');
    return response.data;
  }

  static async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  }

  static async updateUser(id, userData) {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  }

  static async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }

  // File upload
  static async uploadFile(file, type = 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default ApiService; 