const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/token');
const { getDBStatus } = require('../config/db');
const { mockUsers } = require('../services/seedService');

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (getDBStatus()) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        role: role === 'admin' ? 'admin' : 'student',
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      });
    } else {
      // In-Memory fallback
      const userExists = mockUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = {
        _id: 'usr_' + Date.now(),
        id: 'usr_' + Date.now(),
        name,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        role: role === 'admin' ? 'admin' : 'student',
        createdAt: new Date().toISOString(),
      };

      mockUsers.push(newUser);
      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Registration successful (In-Memory Demo)',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
        },
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (getDBStatus()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      });
    } else {
      // In-Memory fallback
      const user = mockUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'Login successful (In-Memory Demo)',
        token,
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
    });
  }
};

module.exports = { register, login, getMe };
