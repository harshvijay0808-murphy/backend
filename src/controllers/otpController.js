const otpService = require('../services/otpService');

const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    const verification = await otpService.sendOtp(phone);
    res.json({ status: verification.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

const verifyOtp = async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: 'Phone and code are required' });

  try {
    const check = await otpService.verifyOtp(phone, code);
    res.json({ status: check.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

module.exports = { sendOtp, verifyOtp };
