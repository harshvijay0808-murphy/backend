// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// // Create a new user
// router.post('/', userController.createUser);

// // Update user password (example)
// router.put('/:id/password', userController.updateUserPassword);

// // Update OTP (example)
// router.put('/otp', userController.updateUserOTP);

// // Clear OTP
// router.put('/:id/clear-otp', userController.clearUserOTP);

module.exports = router;