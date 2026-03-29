import express from 'express';
import { register, login, refresh } from '../controllers/authController.js';
import { registerSchema, loginSchema, refreshSchema } from '../validators/auth.js';
import validate from '../middlewares/validate.js';
import authenticate from '../middlewares/authenticate.js';

/**
 * Authentication routes
 * Public endpoints: POST /register, POST /login
 * Protected endpoints: POST /refresh
 */

const router = express.Router();

// Public endpoints
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected endpoints
router.post('/refresh', authenticate, validate(refreshSchema), refresh);

export default router;
