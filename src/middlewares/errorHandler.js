/* eslint-disable no-console */

/**
 * Express error handling middleware
 * Catches all errors and returns semantic HTTP responses with proper logging
 */

const errorHandler = (err, req, res, _next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.userId || req.userId || 'anonymous',
    timestamp: new Date().toISOString(),
  });

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errorCode = err.errorCode || err.code || 'INTERNAL_ERROR';

  res.status(statusCode).json({
    success: false,
    error: errorCode,
    message,
    statusCode,
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
