# Online Course Platform Backend API

A Node.js REST API backend for the Online Course Platform, built with Express.js, MongoDB, and JWT authentication.

## Features

- **RESTful API**: Follow HTTP conventions for resource management
- **Authentication**: JWT-based authentication with role-based access control (RBAC)
- **Database**: MongoDB with Mongoose ODM for schema validation
- **Validation**: Joi schemas for comprehensive input validation
- **Middleware**: Morgan logging, CORS, error handling
- **Code Quality**: ESLint + Prettier for consistency
- **Testing**: Jest for unit and integration tests
- **Security**: Environment-based configuration, bcrypt password hashing, no hardcoded secrets

## Tech Stack

- **Runtime**: Node.js 18 LTS or higher
- **Framework**: Express.js 4.x
- **Database**: MongoDB 5.0+ with Mongoose 6.x+ ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Password Hashing**: bcrypt
- **Environment Config**: dotenv
- **Logging**: Morgan
- **Testing**: Jest
- **Code Quality**: ESLint + Prettier

## Prerequisites

- Node.js 18 LTS or higher: [Download](https://nodejs.org/)
- npm 9 or higher (comes with Node.js)
- MongoDB 5.0+ (local or MongoDB Atlas cloud instance)
- Git

**Verify Node.js version**:

```bash
node --version  # Should output v18.x or higher
npm --version   # Should output 9.x or higher
```

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd online-course-platform-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and configure:

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Min 32 characters for token signing
- `NODE_ENV`: Set to `development` for local

### 4. Start Development Server

```bash
npm run dev
```

Server will start on configured PORT (default: http://localhost:5000)

### 5. Verify Health Check

```bash
curl http://localhost:5000/health
# Expected response: { "status": "ok", "timestamp": "...", "uptime": ... }
```

## Project Structure

```
├── src/
│   ├── config/          # Configuration files (database, environment)
│   ├── controllers/     # Request handlers and business logic
│   ├── middlewares/     # Express middleware (auth, validation, error handling)
│   ├── models/          # Mongoose schemas (entities)
│   ├── routes/          # Express route definitions
│   ├── validators/      # Joi validation schemas
│   ├── app.js          # Express application setup
│   └── index.js        # Server entry point
├── tests/
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/            # End-to-end tests
├── .env.example        # Environment variable template
├── .gitignore          # Git exclusions
├── .eslintrc.json      # ESLint configuration
├── .prettierrc.json    # Prettier configuration
├── jest.config.js      # Jest testing configuration
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Available npm Scripts

```bash
npm start              # Run production server
npm run dev            # Run development server with auto-restart (nodemon)
npm test               # Run all tests
npm run test:ci        # Run tests with coverage (CI environment)
npm run lint           # Check code quality with ESLint
npm run lint:fix       # Fix ESLint violations automatically
npm run format         # Format code with Prettier
```

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

- `POST /auth/register` - Register new user (Instructor or Student)
- `POST /auth/login` - Authenticate user and receive JWT token

### Course Endpoints

- `POST /courses` - Create new course (Instructor only)
- `GET /courses` - List all courses with pagination
- `GET /courses/:courseId` - Get course details

### Lesson Endpoints

- `POST /courses/:courseId/lessons` - Add lesson to course (Instructor)
- `GET /courses/:courseId/lessons` - Get course lessons

### Enrollment Endpoints

- `POST /courses/:courseId/enroll` - Enroll student in course

### Comment Endpoints

- `POST /lessons/:lessonId/comments` - Add comment to lesson (Student)
- `GET /lessons/:lessonId/comments` - Get lesson comments

### Health Check

- `GET /health` - Server health check

For detailed API contracts, see `/specs/001-foundation-arch/contracts/api.md`

## Roles & Permissions

### Instructor

- Create and manage courses
- Add lessons to courses
- View student enrollments

### Student

- View courses
- Enroll in courses
- Post comments on lessons
- View lesson comments

## Environment Variables

| Variable      | Description                       | Example                                            |
| ------------- | --------------------------------- | -------------------------------------------------- |
| `PORT`        | Server port                       | `5000`                                             |
| `NODE_ENV`    | Environment mode                  | `development` \| `production`                      |
| `MONGODB_URI` | MongoDB connection string         | `mongodb://localhost:27017/online-course-platform` |
| `JWT_SECRET`  | JWT signing secret (min 32 chars) | `your-secret-key-here`                             |
| `JWT_EXPIRY`  | Token expiration time             | `24h`                                              |
| `LOG_LEVEL`   | Logging level                     | `debug` \| `info` \| `warn` \| `error`             |
| `CORS_ORIGIN` | Allowed CORS origins              | `http://localhost:3000`                            |

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b [feature-id-description]
```

### 2. Write Tests First (TDD)

```bash
# Write tests in tests/unit/ or tests/integration/
# Run tests while developing
npm test
```

### 3. Implement Feature

```bash
# Follow MVC pattern:
# - Create Mongoose schema in src/models/
# - Implement controller in src/controllers/
# - Add Joi validator in src/validators/
# - Create route in src/routes/
# - Add middleware for auth/validation in src/middlewares/
```

### 4. Lint & Format

```bash
npm run lint:fix
npm run format
```

### 5. Commit & Push

```bash
git add .
git commit -m "feat: description of changes"
git push origin [feature-branch]
```

### 6. Create Pull Request

- Reference specification and tasks
- Include test results
- Request peer review

## Troubleshooting

### Server won't start

- **Error**: `Error: EADDRINUSE: address already in use :::5000`

  - Solution: Change PORT in .env or kill process using port 5000

- **Error**: `MongooseError: Cannot connect to MongoDB`

  - Solution: Verify MONGODB_URI in .env; ensure MongoDB is running

- **Error**: `undefined: JWT_SECRET not found`
  - Solution: Ensure .env file exists and contains JWT_SECRET

### npm install fails

- Try installing dependencies again: `npm install`
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Tests failing

```bash
npm run test              # Run tests in watch mode
npm run test:ci           # Run with coverage report
```

## Contributing

1. Follow the Git workflow above
2. All code must pass ESLint: `npm run lint`
3. All code must be formatted: `npm run format`
4. All tests must pass: `npm run test`
5. Maintain minimum 80% code coverage

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [JWT Authentication](https://jwt.io/)
- [Joi Validation](https://joi.dev/)

## License

Proprietary - Online Course Platform

## Support

For issues or questions, please contact the development team.

---

**Last Updated**: 2026-03-29  
**Status**: Phase 0 - Foundation Ready
