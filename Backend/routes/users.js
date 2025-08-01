const express = require('express');
const router = express.Router();
const { getMe, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/me', protect, getMe);
router.get('/', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;