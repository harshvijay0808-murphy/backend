const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/';
    if (file.fieldname === 'image_aadhar') folder += 'aadhar/';
    else if (file.fieldname === 'image_pan') folder += 'pan/';

    // Ensure the folder exists
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = req.body.name ? req.body.name.replace(/\s+/g, '_') : 'unknown';

    let uniquePart = 'unknown';
    if (file.fieldname === 'image_aadhar') {
      const aadhar = req.body.aadhar_num || 'noaadhar';
      uniquePart = aadhar;
    } else if (file.fieldname === 'image_pan') {
      const pan = req.body.pan_num || 'nopan';
      uniquePart = pan;
    }

    cb(null, `${name}_${uniquePart}${ext}`);
  }
});

// File filter: accept only png, jpg, jpeg
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg and .jpeg files are allowed!'));
  }
};

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter
});

module.exports = upload;
