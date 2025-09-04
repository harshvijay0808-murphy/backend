const db = require('../config/db');

const User = {
    findByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    },
    create: (name, email, hashedPassword, mobile, callback) => {
        db.query(
            'INSERT INTO users (name, email, password, mobile) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, mobile],
            callback
        );
    },

     // Store OTP & expiry
    updateOTP: (email, hashedOTP, expiry, callback) => {
        db.query(
            'UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?',
            [hashedOTP, expiry, email],
            callback
        );
    },

    // Clear OTP after use
   
    clearOTP: (id, callback) => {
        db.query(
            'UPDATE users SET otp = NULL, otp_expiry = NULL WHERE id = ?',
            [id],
            callback
        );
    },

    // Find by email & include OTP data
    findWithOTP: (email, callback) => {
        db.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            callback
        );
    },
    
    updatePassword: (id, hashedPassword, callback) => {
        db.query(
            'UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE id = ?',
            [hashedPassword, id],
            callback
        );
    },

    // updateResetToken: (email, token, expiry, callback) => {
    //     db.query(
    //         'UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?',
    //         [token, expiry, email],
    //         callback
    //     );
    // },
    // findByResetToken: (token, callback) => {
    //     db.query(
    //         'SELECT * FROM users WHERE resetToken = ? AND resetTokenExpiry > NOW()',
    //         [token],
    //         callback
    //     );
    // },
    // updatePassword: (id, hashedPassword, callback) => {
    //     db.query(
    //         'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?',
    //         [hashedPassword, id],
    //         callback
    //     );
    // }


    getAll: (callback) => {
        db.query('SELECT * FROM users ORDER BY id ASC', callback);
    },

    // Find user by ID
    findById: (id, callback) => {
        db.query('SELECT * FROM users WHERE id = ?', [id], callback);
    }
};

module.exports = User;
