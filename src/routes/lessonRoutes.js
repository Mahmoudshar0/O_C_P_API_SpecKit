import express from 'express';
import { create, listByCourse } from '../controllers/lessonController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import validate from '../middlewares/validate.js';
import { createLessonSchema } from '../validators/lesson.js';

const router = express.Router({ mergeParams: true });

router.get('/lessons', listByCourse);
router.post(
  '/lessons',
  authenticate,
  authorize('instructor', 'admin'),
  validate(createLessonSchema),
  create
);

export default router;
