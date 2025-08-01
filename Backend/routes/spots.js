const express = require('express');
const router = express.Router();
const { getSpots, createSpot, updateSpot, deleteSpot } = require('../controllers/spotController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getSpots);
router.post('/', protect, admin, createSpot);
router.put('/:id', protect, admin, updateSpot);
router.delete('/:id', protect, admin, deleteSpot);

module.exports = router;