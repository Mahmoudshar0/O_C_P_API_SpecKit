import Joi from 'joi';

const enrollSchema = Joi.object({
  courseId: Joi.string().length(24).hex().required().messages({
    'string.length': 'courseId must be a valid MongoDB ObjectId',
    'any.required': 'courseId is required',
  }),
});

const listMyEnrollmentsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

export { enrollSchema, listMyEnrollmentsQuerySchema };
