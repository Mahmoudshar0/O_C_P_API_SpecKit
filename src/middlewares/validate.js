import { errorResponse } from '../utils/response.js';

const validateOptions = {
  stripUnknown: true,
  convert: true,
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
};

const mapJoiErrors = (error) =>
  error.details.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message,
  }));

/**
 * Validates request body
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, validateOptions);

      if (error) {
        const errors = mapJoiErrors(error);
        return res
          .status(422)
          .json(errorResponse('VALIDATION_ERROR', 'Validation failed', 422, { errors }));
      }

      req.validated = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Validates query string (pagination, filters)
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.query, validateOptions);

      if (error) {
        const errors = mapJoiErrors(error);
        return res
          .status(422)
          .json(errorResponse('VALIDATION_ERROR', 'Validation failed', 422, { errors }));
      }

      req.validatedQuery = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validate;
export { validateQuery };
