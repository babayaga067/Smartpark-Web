const express = require('express');
const router = express.Router();
const { 
  getParkingPlaces, 
  getParkingPlace, 
  createParkingPlace, 
  updateParkingPlace, 
  deleteParkingPlace,
  getParkingPlaceSlots,
  addParkingPlaceSlot,
  updateParkingPlaceSlot,
  deleteParkingPlaceSlot
} = require('../controllers/parkingPlaceController');
const { protect, admin } = require('../middleware/auth');

// Public routes (for viewing)
router.get('/', getParkingPlaces);
router.get('/:id', getParkingPlace);
router.get('/:id/slots', getParkingPlaceSlots);

// Admin routes
router.post('/', protect, admin, createParkingPlace);
router.put('/:id', protect, admin, updateParkingPlace);
router.delete('/:id', protect, admin, deleteParkingPlace);
router.post('/:id/slots', protect, admin, addParkingPlaceSlot);
router.put('/:id/slots/:slotId', protect, admin, updateParkingPlaceSlot);
router.delete('/:id/slots/:slotId', protect, admin, deleteParkingPlaceSlot);

module.exports = router; 