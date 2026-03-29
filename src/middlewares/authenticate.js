import { verifyToken } from '../utils/jwt.js';

/**
 * Authentication middleware
 * Extracts and verifies JWT from Authorization header
 * Attaches decoded user data to req.user
 */

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const error = new Error('Missing authorization header');
      error.statusCode = 401;
      error.errorCode = 'NO_TOKEN';
      throw error;
    }

    // Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      const error = new Error('Invalid authorization header format');
      error.statusCode = 401;
      error.errorCode = 'INVALID_TOKEN_FORMAT';
      throw error;
    }

    const token = parts[1];

    // Verify token
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = error.statusCode || 401;
    err.errorCode = error.errorCode || 'INVALID_TOKEN';
    next(err);
  }
};

export default authenticate;
