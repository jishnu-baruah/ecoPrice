
// src/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpire } = require('../config/environment');

const userController = {
  // Register new user
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        email,
        password,
        name
      });

      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: jwtExpire
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: jwtExpire
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    try {
      const user = await User.findById(req.user._id);

      user.name = req.body.name || user.name;
      user.profile.preferences = req.body.preferences || user.profile.preferences;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile: updatedUser.profile
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController;
