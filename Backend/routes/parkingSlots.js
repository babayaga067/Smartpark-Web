const express = require('express');
const router = express.Router();
const { 
  getParkingSlots, 
  getParkingSlot, 
  createParkingSlot, 
  updateParkingSlot, 
  deleteParkingSlot,
  checkAvailability,
  calculatePrice,
  getSlotStatistics
} = require('../controllers/parkingSlotController');
const { protect, admin } = require('../middleware/auth');

// Public routes (for viewing)
router.get('/', getParkingSlots);
router.get('/:id', getParkingSlot);
router.post('/check-availability', checkAvailability);
router.post('/calculate-price', calculatePrice);

// Admin routes
router.post('/', protect, admin, createParkingSlot);
router.put('/:id', protect, admin, updateParkingSlot);
router.delete('/:id', protect, admin, deleteParkingSlot);
router.get('/statistics/overview', protect, admin, getSlotStatistics);

module.exports = router; 