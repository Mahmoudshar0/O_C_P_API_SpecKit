import Joi from 'joi';

const createCourseSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    'string.min': 'Title must be at least 5 characters',
    'string.max': 'Title must not exceed 200 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().min(20).max(2000).required().messages({
    'string.min': 'Description must be at least 20 characters',
    'string.max': 'Description must not exceed 2000 characters',
    'any.required': 'Description is required',
  }),
  category: Joi.string()
    .valid('web-development', 'data-science', 'mobile-dev')
    .optional()
    .messages({
      'any.only': 'Category must be one of: web-development, data-science, mobile-dev',
    }),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  description: Joi.string().min(20).max(2000).optional(),
  category: Joi.string()
    .valid('web-development', 'data-science', 'mobile-dev')
    .optional()
    .allow(null, ''),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

const listCoursesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sortBy: Joi.string().valid('createdAt', 'title', 'instructor').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  category: Joi.string().optional().allow(''),
});

export { createCourseSchema, updateCourseSchema, listCoursesQuerySchema };
