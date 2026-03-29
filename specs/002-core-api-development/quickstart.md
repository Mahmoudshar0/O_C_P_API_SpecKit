# Developer Quickstart Guide

**Phase**: 1 - Design & Contracts  
**Purpose**: Enable any developer to set up the development environment in < 10 minutes  
**Last Updated**: March 29, 2026  
**Branch**: 002-core-api-development

---

## Prerequisites (1 minute)

Before starting, ensure you have these tools installed on your machine:

### Required

- **Git**: Version control

  - [Download](https://git-scm.com/)
  - Verify: `git --version`

- **Node.js 18+**: JavaScript runtime (includes npm)

  - [Download](https://nodejs.org/) - Select LTS (18+)
  - Verify: `node --version` and `npm --version`

- **MongoDB**: Local database instance

  - Option 1: [Local installation](https://docs.mongodb.com/manual/installation/)
  - Option 2: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud database)
  - Verify (local): `mongod --version`

- **Text Editor**: VSCode, WebStorm, or any text editor
  - [VSCode](https://code.visualstudio.com/)

### Optional (But Recommended)

- **Postman**: API testing client

  - [Download](https://www.postman.com/downloads/)
  - Used to test endpoints (collection provided in POSTMAN_ENDPOINTS.md)

- **MongoDB Compass**: MongoDB GUI client (for visual database inspection)
  - [Download](https://www.mongodb.com/products/compass)

---

## Step 1: Clone Repository (2 minutes)

```bash
# Navigate to your desired workspace
cd /path/to/working/directory

# Clone the repository
git clone https://github.com/your-org/course-platform.git

# Navigate into project directory
cd course-platform

# Checkout the development branch
git checkout 002-core-api-development
```

**Expected Output**:

```
...cloning into course-platform...
Switched to branch '002-core-api-development'
```

---

## Step 2: Install Dependencies (3 minutes)

```bash
# Install all npm packages (EXPRESS, Mongoose, JWT, Joi, bcrypt, etc.)
npm install

# Verify installation
npm list --depth=0
```

**Expected Output**:

```
course-platform@1.0.0
├── express@4.18.2
├── mongoose@7.0.0
├── jsonwebtoken@9.0.0
├── joi@17.9.1
├── bcrypt@5.1.0
├── dotenv@16.0.3
├── morgan@1.10.0
├── nodemon@2.0.20 (dev)
├── jest@29.5.0 (dev)
...
└── (573+ additional packages)

577 packages installed successfully
```

**If Installation Fails**:

- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules`
- Retry: `npm install`

---

## Step 3: Configure Environment Variables (2 minutes)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your values
# Open .env in your text editor and fill in the values:
nano .env
# OR use VSCode:
code .env
```

**Template (.env.example)**:

```bash
PORT=5000                                          # Server port (default: 5000)
NODE_ENV=development                               # Environment mode (development|production)
MONGODB_URI=mongodb://localhost:27017/course-app  # MongoDB connection URL
JWT_SECRET=your_super_secret_key_change_in_prod  # Change this! Use strong random string in production
JWT_EXPIRY=24h                                    # JWT token expiry (24 hours)
LOG_LEVEL=debug                                   # Log level (debug|info|warn|error)
CORS_ORIGIN=http://localhost:3000                # Frontend origin for CORS
```

**For Development**:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/course-platform
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRY=24h
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

**For MongoDB Atlas (Cloud)**:
Replace MONGODB_URI with:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course-platform
```

(Get connection string from MongoDB Atlas dashboard)

---

## Step 4: Start Development Server (1 minute)

```bash
# Start development server with auto-reload (nodemon)
npm run dev

# OR start production server (one-time start)
npm start
```

**Expected Output**:

```
✓ Environment variables validated
✓ MongoDB connected
✓ Server started on port 5000
```

**Server is Running**:

- REST API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

---

## Step 5: Test Development Environment (2 minutes)

### Option A: Test Health Endpoint (curl)

```bash
# In a NEW terminal, test the health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2026-03-29T10:30:45.123Z",
#   "uptime": 125.456
# }
```

### Option B: Test via Postman (Recommended)

1. Open Postman
2. Create a new GET request: `http://localhost:5000/api/health`
3. Click Send
4. Should see status 200 OK with response body

### Option C: Test via HTTP Client (VSCode)

1. Create file `test.http`
2. Add request:

```http
GET http://localhost:5000/api/health
```

3. Click "Send Request"

---

## Step 6: Code Quality Checks (1 minute)

```bash
# Check for linting errors
npm run lint

# Auto-fix formatting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Run tests (currently minimal, expanded in Phase 5)
npm test
```

**Expected Output**:

```
✓ ESLint: 0 errors, 0 warnings
✓ Prettier: All files formatted correctly
```

---

## Common Commands

### Development Workflow

```bash
# Start development server (with auto-reload)
npm run dev

# Run linting checks
npm run lint

# Auto-fix lint and format issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Run tests with coverage report
npm run test:ci
```

### Database Operations

```bash
# Start local MongoDB server (if installed locally)
mongod

# Connect to MongoDB locally
mongo

# Connect to MongoDB Atlas
mongo "mongodb+srv://username:password@cluster.mongodb.net/database"

# View database in MongoDB Compass GUI
# Open Compass → Connect → Enter MONGODB_URI
```

---

## Project Structure

After installation, your project structure should look like:

```
course-platform/
├── src/
│   ├── index.js             # Server entry point
│   ├── app.js               # Express setup
│   ├── config/              # Configuration
│   ├── models/              # Mongoose schemas (coming Phase 4)
│   ├── controllers/         # Business logic (coming Phase 4)
│   ├── routes/              # API routes (coming Phase 4)
│   ├── middlewares/         # Auth, validation, error handling
│   ├── validators/          # Joi schemas (coming Phase 4)
│   └── utils/               # Helper functions
├── tests/                   # Test suites (coming Phase 5)
├── specs/                   # Documentation
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Environment template
├── .eslintrc.json           # Linting configuration
├── .prettierrc.json         # Formatting configuration
├── package.json             # Dependencies and scripts
├── jest.config.js           # Test configuration
└── README.md                # Project documentation
```

---

## Next Steps

### For Backend Developers (Phase 4 Implementation)

1. **Implement Models** (1 day):

   - Create 5 Mongoose models in `/src/models/`
   - Refer to data-model.md for schema definitions

2. **Implement Controllers & Routes** (2-3 days):

   - Implement business logic in `/src/controllers/`
   - Create Express routes in `/src/routes/`
   - Handle all 11 endpoints as specified in contracts/

3. **Implement Validation** (1 day):

   - Create Joi schemas in `/src/validators/`
   - Wire validators into route handlers

4. **Test Endpoints** (1-2 days):
   - Use Postman collection to test all 11 endpoints
   - Write unit and integration tests

### For Frontend Developers

1. **Review API Documentation**:

   - Read [POSTMAN_ENDPOINTS.md](../POSTMAN_ENDPOINTS.md)
   - Review endpoint contracts in `/specs/002-core-api-development/contracts/`

2. **Test Against Development Server**:

   - Start backend: `npm run dev`
   - Import Postman collection: `postman-collection.json`
   - Test endpoints as backend implements them

3. **Setup Frontend Development**:
   - Create fetch/axios clients pointing to http://localhost:5000/api
   - Handle JWT tokens from /auth/login response
   - Store tokens in localStorage or sessionStorage

---

## Troubleshooting

### Issue: "Port 5000 already in use"

```bash
# Find process using port 5000
lsof -i :5000

# Kill process (macOS/Linux)
kill -9 <PID>

# OR change PORT in .env to 5001
PORT=5001
```

### Issue: "MongoDB connection refused"

```bash
# Check if MongoDB is running
mongod --version

# If not installed, install locally OR use MongoDB Atlas (cloud)
# Update .env with MongoDB Atlas connection string
```

### Issue: "npm install fails"

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "ESLint errors prevent commit"

```bash
# Auto-fix linting issues
npm run lint:fix

# OR bypass hooks (NOT RECOMMENDED - defeats purpose)
git commit --no-verify
```

---

## IDE Setup (Recommended: VSCode)

### Extensions to Install

1. **ESLint**

   - Search: "ESLint"
   - Publisher: Microsoft
   - Provides real-time linting feedback

2. **Prettier**

   - Search: "Prettier"
   - Publisher: Prettier
   - Auto-format on save

3. **Postman**

   - Search: "Postman"
   - Test APIs directly in VSCode

4. **MongoDB**

   - Search: "MongoDB"
   - View/edit MongoDB data directly

5. **Jest**
   - Search: "Jest"
   - Run tests and see coverage

### VSCode Settings (`.vscode/settings.json`)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## First Successful Test

Once everything is set up, you should see:

```
✓ Repository cloned
✓ Dependencies installed (577+ packages)
✓ Environment variables configured
✓ Development server starts (npm run dev)
✓ Health health endpoint responds (GET /api/health → 200 OK)
✓ Linting passes (npm run lint)
✓ Tests pass (npm test)
```

**Congratulations!** 🎉 Development environment is ready for Phase 4 implementation.

---

## Documentation Reference

| Document                                                 | Purpose                                  |
| -------------------------------------------------------- | ---------------------------------------- |
| [spec.md](spec.md)                                       | Feature specification with user stories  |
| [plan.md](plan.md)                                       | Implementation plan and architecture     |
| [data-model.md](data-model.md)                           | Database schema and entity relationships |
| [research.md](research.md)                               | Technology decisions and justifications  |
| [contracts/](contracts/)                                 | REST endpoint specifications             |
| [../POSTMAN_ENDPOINTS.md](../../../POSTMAN_ENDPOINTS.md) | API documentation and Postman collection |
| [../README.md](../../../README.md)                       | Project overview and setup instructions  |

---

**Setup Time**: ~10 minutes  
**Status**: ✅ Development environment ready  
**Next Phase**: Phase 4 - Core Development (implement 11 endpoints)
