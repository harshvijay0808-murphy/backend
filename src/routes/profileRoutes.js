const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const multer = require('multer');
const fs = require('fs');

// Ensure upload folder exists
const uploadDir = 'uploads/avatars';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.get('/', profileController.getProfile);
router.put('/update', profileController.updateProfile);
router.post('/change-password', profileController.changePassword);
router.post('/avatar', upload.single('avatar'), profileController.uploadAvatar);

module.exports = router;
