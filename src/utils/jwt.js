import jwt from 'jsonwebtoken';

/**
 * JWT utility functions for token generation and verification
 */

const generateToken = (userId, role) => {
  try {
    const payload = {
      userId,
      role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
      algorithm: 'HS256',
      issuer: 'course-platform-api',
    });

    return token;
  } catch (error) {
    throw new Error(`Failed to generate token: ${error.message}`);
  }
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Failed to decode token');
  }
};

export { generateToken, verifyToken, decodeToken };
