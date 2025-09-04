const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// -------- GET PROFILE --------
exports.getProfile = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findByEmail(email);
    if (!user || user.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json(user[0]);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// -------- UPDATE PROFILE --------
exports.updateProfile = async (req, res) => {
  try {
    const { email, name, phone } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    await User.updateProfileByEmail(email, { name, phone });
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// -------- CHANGE PASSWORD --------
exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findByEmail(email);
    if (!user || user.length === 0) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(oldPassword, user[0].password);
    if (!match) return res.status(400).json({ message: 'Old password is incorrect' });

    const sameAsOld = await bcrypt.compare(newPassword, user[0].password);
    if (sameAsOld) return res.status(400).json({ message: 'New password cannot be the same as old password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user[0].id, hashedPassword);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// -------- UPLOAD AVATAR --------
exports.uploadAvatar = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const avatarPath = req.file.path;

    const user = await User.findByEmail(email);
    if (!user || user.length === 0) return res.status(404).json({ message: 'User not found' });

    if (user[0].avatar) {
      fs.unlink(path.join(__dirname, '..', user[0].avatar), () => {});
    }

    await User.updateProfileByEmail(email, { avatar: avatarPath });

    res.json({ message: 'Avatar uploaded successfully', avatar: avatarPath });
  } catch (err) {
    console.error('Upload avatar error:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};
