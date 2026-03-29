/* eslint-disable no-console */

/**
 * Express error handling middleware
 * Catches all errors and returns semantic HTTP responses with proper logging
 */

const errorHandler = (err, req, res) => {
  // Log error context
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.userId || 'anonymous',
    timestamp: new Date().toISOString(),
  });

  // Determine HTTP status code
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Return semantic error response
  res.status(statusCode).json({
    success: false,
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? { stack: err.stack } : {},
    timestamp: new Date().toISOString(),
  });
};

export default errorHandler;
