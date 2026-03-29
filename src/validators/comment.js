import Joi from 'joi';

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(500).required().messages({
    'string.min': 'Comment must be between 1 and 500 characters',
    'string.max': 'Comment must be between 1 and 500 characters',
    'any.required': 'Content is required',
  }),
});

const listCommentsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export { createCommentSchema, listCommentsQuerySchema };
