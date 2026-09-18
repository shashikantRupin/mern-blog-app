require('dotenv').config();
const express = require('express');
const { connectDB } = require('./configs/db');
const bcrypt = require('bcrypt');
const UserModel = require('./models/User.module');
const OtpModel = require('./models/Otp.module');
const { sendOtpEmail } = require('./utils/emailService');
const jwt = require('jsonwebtoken');
const blogRouter = require('./Router/blog.Routes');
const { authentication } = require('./middleware/authentication');
const cors = require('cors');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.json({ msg: 'MERN Blog App API is running' });
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please provide all required fields (name, email, password)' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Strong Password Validation: 8+ chars, uppercase, lowercase, number, special char
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
      return res.status(400).json({
        msg: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., Rupin@123).'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    return res.status(201).json({
      msg: 'Sign up successful',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ msg: 'Server error during sign up', error: error.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const secretKey = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '7d' });

    return res.status(200).json({
      msg: 'Login successful',
      token,
      name: user.name,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ msg: 'Server error during login', error: error.message });
  }
});

// ==========================================
// FORGOT PASSWORD & OTP VERIFICATION ENDPOINTS
// ==========================================

// 1. Send OTP to user's email
app.post('/forgot-password/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: 'Please provide your registered email address.' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ msg: 'No account found with this email address.' });
    }

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Invalidate any existing OTP for this email
    await OtpModel.deleteMany({ email: normalizedEmail });

    // Store new OTP with 10-minute expiry
    await OtpModel.create({
      email: normalizedEmail,
      otp,
    });

    // Send Email with OTP template
    try {
      await sendOtpEmail({
        to: normalizedEmail,
        otp,
        userName: user.name,
      });
    } catch (mailError) {
      console.error('[MAIL ERROR] Failed to send email via transporter:', mailError);
    }

    console.log(`\n========================================`);
    console.log(`[FORGOT PASSWORD] Generated OTP for: ${normalizedEmail}`);
    console.log(`[FORGOT PASSWORD] 6-Digit OTP Code: ${otp}`);
    console.log(`========================================\n`);

    return res.status(200).json({
      msg: `A 6-digit verification code has been sent to ${normalizedEmail}. Please check your inbox.`,
      email: normalizedEmail,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ msg: 'Failed to generate verification code. Please try again.', error: error.message });
  }
});

// 2. Verify OTP
app.post('/forgot-password/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ msg: 'Email and 6-digit verification code are required.' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    const otpRecord = await OtpModel.findOne({ email: normalizedEmail, otp: cleanOtp });
    if (!otpRecord) {
      return res.status(400).json({ msg: 'Invalid or expired verification code. Please request a new code.' });
    }

    return res.status(200).json({
      msg: 'Verification code verified successfully.',
      verified: true,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ msg: 'Error verifying code. Please try again.', error: error.message });
  }
});

// 3. Reset Password with OTP & New Password
app.post('/forgot-password/reset-password', async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword) {
    return res.status(400).json({ msg: 'Please provide all required fields.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ msg: 'New password and confirm password do not match.' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Verify OTP record
    const otpRecord = await OtpModel.findOne({ email: normalizedEmail, otp: cleanOtp });
    if (!otpRecord) {
      return res.status(400).json({ msg: 'Verification code is invalid or has expired. Please request a new one.' });
    }

    // Strong Password Validation matching signup rules
    const hasMinLength = newPassword.length >= 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasDigit = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(newPassword);

    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
      return res.status(400).json({
        msg: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., Rupin@123).'
      });
    }

    // Find User
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ msg: 'User account not found.' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Invalidate the used OTP
    await OtpModel.deleteMany({ email: normalizedEmail });

    return res.status(200).json({
      msg: 'Password has been successfully reset! You can now log in with your new password.',
      success: true,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ msg: 'Failed to reset password. Please try again.', error: error.message });
  }
});

// Protected Blog Routes
app.use('/blogs', authentication, blogRouter);

const PORT = process.env.PORT || 7000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Initial DB connection failed:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

module.exports = app;
