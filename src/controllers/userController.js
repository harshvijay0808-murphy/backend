// controllers/userController.js
const User = require('../models/userModel');

// Get all users
exports.getAllUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ success: false, error: 'Database error' });
        }
        res.json({ success: true, data: results });
    });
};

// Get user by ID
exports.getUserById = (req, res) => {
    const { id } = req.params;
    User.findById(id, (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ success: false, error: 'Database error' });
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: results[0] });
    });
};

// // Create a new user
// exports.createUser = (req, res) => {
//     const { name, email, password, mobile } = req.body;
//     User.create(name, email, password, mobile, (err, result) => {
//         if (err) {
//             console.error('Error creating user:', err);
//             return res.status(500).json({ success: false, error: 'Database error' });
//         }
//         res.status(201).json({ success: true, message: 'User created successfully', userId: result.insertId });
//     });
// };

// // Update user password (example)
// exports.updateUserPassword = (req, res) => {
//     const { id } = req.params;
//     const { password } = req.body;
//     User.updatePassword(id, password, (err) => {
//         if (err) {
//             console.error('Error updating password:', err);
//             return res.status(500).json({ success: false, error: 'Database error' });
//         }
//         res.json({ success: true, message: 'Password updated successfully' });
//     });
// };

// // Update OTP (example)
// exports.updateUserOTP = (req, res) => {
//     const { email, otp, expiry } = req.body;
//     User.updateOTP(email, otp, expiry, (err) => {
//         if (err) {
//             console.error('Error updating OTP:', err);
//             return res.status(500).json({ success: false, error: 'Database error' });
//         }
//         res.json({ success: true, message: 'OTP updated successfully' });
//     });
// };

// // Clear OTP
// exports.clearUserOTP = (req, res) => {
//     const { id } = req.params;
//     User.clearOTP(id, (err) => {
//         if (err) {
//             console.error('Error clearing OTP:', err);
//             return res.status(500).json({ success: false, error: 'Database error' });
//         }
//         res.json({ success: true, message: 'OTP cleared successfully' });
//     });
// };
