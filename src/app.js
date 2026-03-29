import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middlewares/index.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

/**
 * Express application setup
 * Configures middleware stack, routes, and error handling
 */

const app = express();

// Middleware stack (order matters!)
// 1. Morgan logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// 2. CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// 3. Body parser (JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Routes
// Health check endpoint (public)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/lessons/:lessonId', commentRoutes);

// 5. 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND',
    path: req.path,
    method: req.method,
  });
});

// 6. Error handler (must be last)
app.use(errorHandler);

export default app;
