const express = require('express');
const router = express.Router();
const { 
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
  getUserBookings,
  getAllBookings,
  searchBookings,
  getBookingStats,
  quickBook,
  processPayment,
  getPaymentStatus,
  checkIn,
  checkOut,
  exportBookings
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.get('/user', protect, getUserBookings);
router.get('/user/:id', protect, getBooking);
router.post('/', protect, createBooking);
router.put('/:id', protect, updateBooking);
router.patch('/:id/cancel', protect, cancelBooking);
router.post('/quick', protect, quickBook);
router.post('/:id/payment', protect, processPayment);
router.get('/:id/payment', protect, getPaymentStatus);

// Admin routes
router.get('/', protect, admin, getAllBookings);
router.get('/search', protect, admin, searchBookings);
router.get('/stats', protect, admin, getBookingStats);
router.delete('/:id', protect, admin, deleteBooking);
router.post('/:id/checkin', protect, admin, checkIn);
router.post('/:id/checkout', protect, admin, checkOut);
router.get('/export/:format', protect, admin, exportBookings);

module.exports = router;