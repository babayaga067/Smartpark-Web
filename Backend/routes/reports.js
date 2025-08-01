const express = require('express');
const router = express.Router();
const { 
  getReports,
  generateReport,
  exportReport,
  getDashboardStats
} = require('../controllers/reportController');
const { protect, admin } = require('../middleware/auth');

// Admin routes
router.get('/', protect, admin, getReports);
router.post('/:type', protect, admin, generateReport);
router.get('/:type/export/:format', protect, admin, exportReport);
router.get('/dashboard/stats', protect, admin, getDashboardStats);

module.exports = router; 