import express from 'express';
import {
  enroll,
  listMyEnrollments,
  getEnrollment,
  unenroll,
} from '../controllers/enrollmentController.js';
import authenticate from '../middlewares/authenticate.js';
import validate, { validateQuery } from '../middlewares/validate.js';
import { enrollSchema, listMyEnrollmentsQuerySchema } from '../validators/enrollment.js';

const router = express.Router();

router.get(
  '/my-courses',
  authenticate,
  validateQuery(listMyEnrollmentsQuerySchema),
  listMyEnrollments
);
router.post('/', authenticate, validate(enrollSchema), enroll);
router.get('/:enrollmentId', authenticate, getEnrollment);
router.delete('/:enrollmentId', authenticate, unenroll);

export default router;
