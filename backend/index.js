require('dotenv').config();
const express = require('express');
const { connectDB } = require('./configs/db');
const bcrypt = require('bcrypt');
const UserModel = require('./models/User.module');
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
