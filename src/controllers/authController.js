const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const db = require('../config/db'); // your MySQL connection

exports.register = (req, res, next) => {
    const { name, email, password, mobile } = req.body;

    // new add
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // end add


    User.findByEmail(email, async (err, results) => {
        if (err) return next(err);
        if (results.length > 0) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Correct argument order: name, email, hashedPassword, mobile, callback
        User.create(name, email, hashedPassword, mobile, (err) => {
            if (err) return next(err);
            res.json({ message: 'User registered successfully' });
        });
    });
};

exports.checkEmail = (req, res, next) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    User.findByEmail(email, (err, results) => {
        if (err) return next(err); // Pass errors to your error handler
        if (results.length > 0) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    });
};

// exports.login = (req, res, next) => {
//     const { email, password } = req.body;

//     User.findByEmail(email, async (err, results) => {
//         if (err) return next(err);
//         if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

//         const user = results[0];
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//         const token = jwt.sign(
//             { id: user.id, email: user.email },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         res.json({ token });
//     });
// };


exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, results) => {
    if (err) return next(err);
    if (results.length === 0) 
      return res.status(400).json({ message: 'Invalid credentials' });

    const user = results[0];

    try {
      // 1. Check employee active status
      db.query(
        `SELECT activeYN FROM employees WHERE registered_email = ? LIMIT 1`,
        [email],
        async (err, empResults) => {
          if (err) return next(err);

          if (empResults.length === 0) {
            return res.status(400).json({ message: 'No employee record found' });
          }


          const employee = empResults[0];
          if (employee.activeYN !== 'Y') {
            return res.status(403).json({ 
              message: 'This one is not active, please contact admin' 
            });
          }

          // 2. Validate password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }

          // 3. Generate JWT
          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          res.json({ token });
        }
      );
    } catch (error) {
      next(error);
    }
  });
};


exports.sendOTP = (req, res, next) => {
    const { email } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err) return next(err);
        if (results.length === 0) return res.status(400).json({ message: 'User not found' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP (hashed for security) in DB
        bcrypt.hash(otp, 10).then(hashedOTP => {
            User.updateOTP(email, hashedOTP, otpExpiry, (err) => {
                if (err) return next(err);

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: '🔐 Your OTP Code',
                    html: `
                        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                <h2 style="color: #333; text-align: center;">Your OTP Code</h2>
                                <p style="font-size: 16px; color: #555; text-align: center;">
                                    Use the following code to reset your password:
                                </p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <span style="background-color: #4CAF50; color: white; padding: 14px 24px; font-size: 24px; letter-spacing: 4px; border-radius: 6px; font-weight: bold;">
                                        ${otp}
                                    </span>
                                </div>
                                <p style="font-size: 14px; color: #999; text-align: center;">
                                    This code will expire in 10 minutes.
                                </p>
                            </div>
                        </div>
                    `
                });

                res.json({ message: 'OTP sent to your email' });
            });
        });
    });
};

// Step 2: Verify OTP
exports.verifyOTP = (req, res, next) => {
    const { email, otp } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err) return next(err);
        if (results.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = results[0];
        if (!user.otp || user.otp_expiry < new Date()) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        bcrypt.compare(otp, user.otp, (err, match) => {
            if (err) return next(err);
            if (!match) return res.status(400).json({ message: 'Invalid OTP' });

            res.json({ message: 'OTP verified' });
        });
    });
};

// Step 3: Reset password with OTP
exports.resetPassword = (req, res, next) => {
    const { email, otp, password } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err) return next(err);
        if (results.length === 0) return res.status(400).json({ message: 'User not found' });

        const user = results[0];
        if (!user.otp || user.otp_expiry < new Date()) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        bcrypt.compare(otp, user.otp, async (err, match) => {
            if (err) return next(err);
            if (!match) return res.status(400).json({ message: 'Invalid OTP' });

            const hashedPassword = await bcrypt.hash(password, 10);
            User.updatePassword(user.id, hashedPassword, (err) => {
                if (err) return next(err);

                // Clear OTP after use
                User.clearOTP(user.id, () => {
                    res.json({ message: 'Password reset successful' });
                });
            });
        });
    });

};
exports.tokenValidation = (req , res) =>{
    console.log("inttokenvalidation")


    console.log(req.user);

    res.json({message : 'token Verified'})
}
// exports.resetPassword = (req, res, next) => {
//     const { token } = req.params;
//     const { password } = req.body;

//     User.findByResetToken(token, async (err, results) => {
//         if (err) return next(err);
//         if (results.length === 0) return res.status(400).json({ message: 'Invalid or expired token' });

//         const hashedPassword = await bcrypt.hash(password, 10);

//         User.updatePassword(results[0].id, hashedPassword, (err) => {
//             if (err) return next(err);
//             res.json({ message: 'Password reset successful' });
//         });
//     });
// };

