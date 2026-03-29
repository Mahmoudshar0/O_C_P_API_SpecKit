import express from 'express';
import { create, list } from '../controllers/commentController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import validate, { validateQuery } from '../middlewares/validate.js';
import { createCommentSchema, listCommentsQuerySchema } from '../validators/comment.js';

const router = express.Router({ mergeParams: true });

router.get('/comments', validateQuery(listCommentsQuerySchema), list);
router.post('/comments', authenticate, authorize('student'), validate(createCommentSchema), create);

export default router;
