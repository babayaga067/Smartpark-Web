const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  createNotification,
  deleteNotification
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markNotificationRead);
router.patch('/read-all', protect, markAllNotificationsRead);

// Admin routes
router.post('/', protect, admin, createNotification);
router.delete('/:id', protect, admin, deleteNotification);

module.exports = router; 