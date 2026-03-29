/* eslint-disable no-console */

/**
 * Environment configuration validation
 * Ensures all required environment variables are present at startup
 */

const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRY',
  'LOG_LEVEL',
];

const validateEnvironment = () => {
  const missing = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    console.error(`✗ ${message}`);
    console.error('Please copy .env.example to .env and configure required values');
    process.exit(1);
  }

  console.log('✓ Environment variables validated');

  return {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY,
    logLevel: process.env.LOG_LEVEL,
    corsOrigin: process.env.CORS_ORIGIN || '*',
  };
};

module.exports = {
  validateEnvironment,
};
