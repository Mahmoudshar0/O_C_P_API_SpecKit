import { errorResponse } from '../utils/response.js';

/**
 * Joi validation middleware
 * Validates request body against provided schema
 * Returns 422 with field-level errors on validation failure
 */

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        stripUnknown: true,
        messages: {
          'any.required': '{#label} is required',
          'string.empty': '{#label} cannot be empty',
          'string.email': '{#label} must be a valid email',
          'string.min': '{#label} must have at least {#limit} characters',
          'string.max': '{#label} must have at most {#limit} characters',
          'number.min': '{#label} must be at least {#limit}',
          'number.max': '{#label} must be at most {#limit}',
          'date.base': '{#label} must be a valid date',
        },
      });

      if (error) {
        const errors = error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        return res
          .status(422)
          .json(errorResponse('VALIDATION_ERROR', 'Validation failed', 422, { errors }));
      }

      // Attach validated data to request
      req.validated = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validate;
