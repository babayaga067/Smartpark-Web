const express = require('express');
const router = express.Router();
const { 
  getStatistics,
  getDashboardStats,
  getRevenueStats,
  getUserStats,
  getParkingStats
} = require('../controllers/statisticsController');
const { protect, admin } = require('../middleware/auth');

// Admin routes
router.get('/', protect, admin, getStatistics);
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/revenue', protect, admin, getRevenueStats);
router.get('/users', protect, admin, getUserStats);
router.get('/parking', protect, admin, getParkingStats);

module.exports = router; 