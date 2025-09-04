const twilio = require('twilio');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = require('../config/env');

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendOtp = async (phone) => {
  return client.verify.v2.services(TWILIO_SERVICE_SID)
    .verifications
    .create({ to: phone, channel: 'sms' });
};

const verifyOtp = async (phone, code) => {
  return client.verify.v2.services(TWILIO_SERVICE_SID)
    .verificationChecks
    .create({ to: phone, code });
};

module.exports = { sendOtp, verifyOtp };
