const express = require('express');
const authMiddleware = require('../middlewares/auth/authMiddleware');
const { 
  register, 
  login, 
  sendOTP,       // new controller function
  verifyOTP,     // new controller function
  resetPassword, // now OTP-based
  checkEmail,
  tokenValidation
} = require('../controllers/authController');

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);         
router.post('/verify-otp', verifyOTP);    
router.post('/reset-password', resetPassword); // Step 3: Reset password
router.post("/check-email", checkEmail);
router.get("/token-validation", authMiddleware, tokenValidation);

module.exports = router;
