const express = require('express');
const router = express.Router();
const { 
  uploadImage,
  uploadAvatar,
  deleteImage
} = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.post('/avatar', protect, uploadAvatar);

// Admin routes
router.post('/image', protect, admin, uploadImage);
router.delete('/image/:id', protect, admin, deleteImage);

module.exports = router; 