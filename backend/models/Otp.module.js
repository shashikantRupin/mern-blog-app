const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // MongoDB TTL index: automatically removes doc after 10 minutes (600 seconds)
    },
  }
);

const OtpModel = mongoose.model('Otp', otpSchema);

module.exports = OtpModel;
