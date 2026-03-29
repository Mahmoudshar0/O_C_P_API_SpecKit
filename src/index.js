#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Server entry point
 * Loads environment, initializes database, and starts Express server
 */

// Load environment variables FIRST
import { validateEnvironment } from './config/environment.js';
import { connectDB } from './config/database.js';
import app from './app.js';

const startServer = async () => {
  try {
    // Validate environment
    const config = validateEnvironment();

    // Connect to database
    await connectDB();

    // Start server
    const server = app.listen(config.port, () => {
      console.log(`✓ Server started on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log('✓ App is ready for requests');
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✓ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('✓ Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
