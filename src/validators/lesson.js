import Joi from 'joi';

const createLessonSchema = Joi.object({
  title: Joi.string().min(1).max(500).required().messages({
    'any.required': 'Title is required',
  }),
  content: Joi.string().min(1).required().messages({
    'any.required': 'Content is required',
  }),
  position: Joi.number().integer().min(1).required().messages({
    'number.min': 'Position must be greater than 0',
    'any.required': 'Position is required',
  }),
});

export { createLessonSchema };
