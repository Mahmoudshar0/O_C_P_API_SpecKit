/**
 * Authorization middleware
 * Checks if user has required role(s)
 */

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        const error = new Error('User not authenticated');
        error.statusCode = 401;
        error.errorCode = 'NOT_AUTHENTICATED';
        throw error;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        const error = new Error(`User role '${req.user.role}' is not authorized for this action`);
        error.statusCode = 403;
        error.errorCode = 'FORBIDDEN';
        throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorize;
