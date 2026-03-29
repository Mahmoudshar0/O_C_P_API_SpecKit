# Quickstart Guide: Phase 0 Completion & Development Setup

**Status**: Phase 1 - Getting Started  
**Date**: 2026-03-29  
**Purpose**: Guide developers through project initialization and first development steps

---

## Prerequisites

Before starting, ensure you have:

1. **Node.js 18 LTS or higher**

   ```bash
   node --version  # Should output v18.x.x or higher
   ```

2. **npm** (comes with Node.js)

   ```bash
   npm --version   # Should output 9.x or higher
   ```

3. **MongoDB** (either installed locally or cloud instance)

   - Local: [Download Community Edition](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas free tier](https://www.mongodb.com/cloud/atlas/register)

4. **Git** for version control

   ```bash
   git --version
   ```

5. **Code Editor**: VS Code, WebStorm, or similar

---

## Step 1: Project Initialization

### Create project folder

```bash
mkdir online-course-platform-api
cd online-course-platform-api
```

### Initialize git repository

```bash
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Initialize Node.js project

```bash
npm init -y
```

This creates `package.json` with default configuration. You'll customize it in the next steps.

---

## Step 2: Install Dependencies

### Core dependencies for Phase 0

```bash
npm install express mongoose dotenv jsonwebtoken joi bcrypt cors morgan
```

**What each package does**:

- **express**: Web framework for building REST API
- **mongoose**: MongoDB object modeling and validation
- **dotenv**: Load environment variables from .env file
- **jsonwebtoken**: JWT token generation and verification
- **joi**: Data validation schemas
- **bcrypt**: Password hashing and comparison
- **cors**: Cross-Origin Resource Sharing middleware
- **morgan**: HTTP request logging

### Development dependencies

```bash
npm install --save-dev nodemon eslint prettier jest supertest
```

**What each dev package does**:

- **nodemon**: Auto-restart server during development
- **eslint**: Code quality linting
- **prettier**: Automatic code formatting
- **jest**: Test framework and runner
- **supertest**: HTTP assertion library for testing

### Install git hooks (optional but recommended)

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "lint-staged"
```

---

## Step 3: Create Project Folder Structure

```bash
# Create directories
mkdir -p src/{config,controllers,middlewares,models,routes,validators}
mkdir -p tests/{unit,integration,e2e}

# Create initial files
touch src/index.js
touch src/config/database.js
touch .env.example
touch .eslintrc.json
touch .prettierrc.json
touch jest.config.js
```

Your project structure should now look like:

```
.
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   └── index.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .eslintrc.json
├── .prettierrc.json
├── jest.config.js
├── package.json
├── package-lock.json
└── .git/
```

---

## Step 4: Configure Environment Variables

### Create `.env.example` (commit to git)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/online-course-platform

# JWT Configuration
JWT_SECRET=your-secret-key-min-32-characters-long
JWT_EXPIRY=24h

# Logging
LOG_LEVEL=debug
```

### Create `.env` (DO NOT commit - add to .gitignore)

Copy `.env.example` to `.env` and customize for your local environment:

```bash
cp .env.example .env
```

Edit `.env` and fill in real values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/online-course-platform
JWT_SECRET=your-super-secret-key-at-least-32-characters-1234567890
JWT_EXPIRY=24h
LOG_LEVEL=debug
```

---

## Step 5: Configure npm Scripts

Edit `package.json` and update the `scripts` section:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest --watch",
    "test:ci": "jest --coverage",
    "lint": "eslint src/ tests/",
    "lint:fix": "eslint src/ tests/ --fix && prettier --write src/ tests/",
    "format": "prettier --write src/ tests/"
  }
}
```

---

## Step 6: Create Express Server (Phase 0 Scaffold)

### Create `src/index.js`

```javascript
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});
```

### Create `src/app.js`

```javascript
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Middleware
app.use(morgan('dev')); // Logging
app.use(cors()); // CORS
app.use(express.json()); // Body parser

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND',
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
```

### Create `src/config/database.js`

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## Step 7: Configure Code Quality Tools

### Create `.eslintrc.json`

```json
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "no-console": ["warn", { "allow": ["log", "warn", "error"] }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
}
```

### Create `.prettierrc.json`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## Step 8: Configure Testing Framework

### Create `jest.config.js`

```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/**/*.js', '!src/index.js', '!src/config/**'],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
};
```

---

## Step 9: Create .gitignore

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables (NEVER commit)
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build & dist
dist/
build/

# Logs
logs/
*.log

# Test coverage
coverage/
.nyc_output/

# Temporary
tmp/
temp/
```

---

## Step 10: First Run

### Start development server

```bash
npm run dev
```

You should see:

```
🚀 Server running on http://localhost:5000
📝 Environment: development
```

### Test health endpoint

In another terminal:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-03-29T10:00:00.000Z",
  "uptime": 1.234
}
```

### Run linting

```bash
npm run lint
```

### Run tests (empty until Phase 1+)

```bash
npm test
```

---

## Step 11: Initial Git Commit

```bash
git add -A
git status  # Review changes
git commit -m "feat: initialize Node.js + Express backend scaffold

- Setup project structure following MVC pattern
- Install core dependencies (express, mongoose, jwt, joi, bcrypt)
- Configure environment variables via dotenv
- Create basic Express server with health check endpoint
- Setup development tools (eslint, prettier, jest)
- Initialize git repository"
```

---

## What's Next?

Phase 0 setup is complete! You now have:
✅ Node.js project initialized with npm  
✅ Project folder structure created (MVC pattern)  
✅ Environment configuration via .env  
✅ Express.js server scaffolded and running  
✅ Health check endpoint working  
✅ Code quality tools configured  
✅ Testing framework ready

### Phase 1 tasks (execute via `/speckit.tasks`):

1. **Implement User model** (Mongoose schema)
2. **Implement Course model**
3. **Implement Lesson model**
4. **Implement Enrollment model**
5. **Implement Comment model**
6. **Create authentication middleware**
7. **Create role-based authorization middleware**
8. **Implement registration endpoint**
9. **Implement login endpoint**
10. And many more...

To generate Phase 1 tasks:

```bash
/speckit.tasks
```

---

## Troubleshooting

### MongoDB connection fails

- Ensure MongoDB service is running: `mongod` command
- Check MONGODB_URI in .env matches your MongoDB instance
- Test connection: `mongosh mongodb://localhost:27017/online-course-platform`

### Port 5000 already in use

- Change PORT in .env to an available port (e.g., 5001, 5002)
- Or kill process using port: `lsof -ti :5000 | xargs kill -9` (macOS/Linux)

### npm install fails with package conflicts

- Delete `node_modules/` and `package-lock.json`
- Run `npm cache clean --force`
- Run `npm install` again

### Environment variables not loading

- Ensure `.env` file exists in project root
- Restart `npm run dev` after modifying `.env`
- Verify dotenv import is first line: `require('dotenv').config();`

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/)
- [Joi Validation Library](https://joi.dev/)

---

**You're ready to start development! 🚀**
