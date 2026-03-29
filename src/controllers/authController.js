/* eslint-disable no-console */

import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';

/**
 * Authentication controller
 * Handles user registration, login, and token refresh
 */

const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role } = req.validated || req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(409)
        .json(errorResponse('USER_EXISTS', 'User with this email already exists', 409));
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      role: role || 'student',
    });

    // Generate JWT token
    const token = generateToken(newUser._id.toString(), newUser.role);

    // Prepare response (exclude passwordHash)
    const userData = {
      userId: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userData,
      token,
      expiresIn: '24h',
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated || req.body;

    // Find user and include password hash for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    // Check if user exists
    if (!user) {
      return res
        .status(401)
        .json(errorResponse('INVALID_CREDENTIALS', 'Invalid email or password', 401));
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(errorResponse('INVALID_CREDENTIALS', 'Invalid email or password', 401));
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    // Prepare response (exclude passwordHash)
    const userData = {
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userData,
      token,
      expiresIn: '24h',
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    // req.user is populated by authenticate middleware
    const { userId, role } = req.user;

    // Generate new token
    const token = generateToken(userId, role);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token,
      expiresIn: '24h',
    });
  } catch (error) {
    next(error);
  }
};

export { register, login, refresh };
