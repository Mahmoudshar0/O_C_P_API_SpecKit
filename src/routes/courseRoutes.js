import express from 'express';
import { create, list, get, update } from '../controllers/courseController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import validate, { validateQuery } from '../middlewares/validate.js';
import {
  createCourseSchema,
  updateCourseSchema,
  listCoursesQuerySchema,
} from '../validators/course.js';
import lessonRoutes from './lessonRoutes.js';

const router = express.Router();

router.get('/', validateQuery(listCoursesQuerySchema), list);

router.use('/:courseId', lessonRoutes);

router.get('/:courseId', get);
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin'),
  validate(createCourseSchema),
  create
);
router.put('/:courseId', authenticate, validate(updateCourseSchema), update);

export default router;
