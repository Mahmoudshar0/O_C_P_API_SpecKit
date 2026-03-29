/* eslint-disable no-console */

/**
 * Standard response formatter for all API responses
 * Ensures consistent response structure across all endpoints
 */

const successResponse = (data, message = 'Success', statusCode = 200) => ({
  success: true,
  message,
  data,
  statusCode,
});

const errorResponse = (error, message = 'Error', statusCode = 500, details = null) => ({
  success: false,
  error,
  message,
  statusCode,
  ...(details && { details }),
});

const paginatedResponse = (items, page, limit, total, message = 'Success') => ({
  success: true,
  message,
  data: {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrevious: page > 1,
    },
  },
});

export { successResponse, errorResponse, paginatedResponse };
