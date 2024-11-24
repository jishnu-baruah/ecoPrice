import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateToken } from '../middleware/auth';
import { CommonErrors } from '../middleware/error';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw CommonErrors.BadRequest('Email already registered');
    }

    // Create new user
    const user = await User.create({
      email,
      name,
      password,
      profile: {
        preferences: {
          preferredCategories: [],
          sustainabilityPriorities: [],
          priceAlerts: false
        }
      }
    });

    // Generate token
    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: 'user'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw CommonErrors.Unauthorized();
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw CommonErrors.Unauthorized();
    }

    // Generate token
    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: 'user'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name, preferences } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw CommonErrors.NotFound('User');
    }

    // Update fields
    if (name) user.name = name;
    if (preferences) {
      user.profile.preferences = {
        ...user.profile.preferences,
        ...preferences
      };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const getSavedProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).populate('savedProducts');
    
    if (!user) {
      throw CommonErrors.NotFound('User');
    }

    res.json({
      savedProducts: user.savedProducts
    });
  } catch (error) {
    console.error('Get saved products error:', error);
    throw error;
  }
};

export const saveProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw CommonErrors.NotFound('User');
    }

    // Check if product is already saved
    if (user.savedProducts.includes(productId)) {
      throw CommonErrors.BadRequest('Product already saved');
    }

    user.savedProducts.push(productId);
    await user.save();

    res.json({
      message: 'Product saved successfully',
      savedProducts: user.savedProducts
    });
  } catch (error) {
    console.error('Save product error:', error);
    throw error;
  }
};