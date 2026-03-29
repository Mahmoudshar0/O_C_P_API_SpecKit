# Research & Technology Decisions

**Phase**: 0 - Research & Clarification  
**Created**: March 29, 2026  
**Feature**: Phases 1-4 Core API Development  
**Branch**: 002-core-api-development

---

## Technology Decisions

### ✅ Decision 1: Node.js 18 LTS as Runtime

**Decision**: Use Node.js 18 LTS (long-term support) with npm 9+ package manager

**Rationale**:

- LTS ensures security patches through April 2025 (stable for production)
- npm ecosystem mature for backend API development
- JavaScript/TypeScript ecosystem rich with Express, Mongoose, testing frameworks
- Fast execution (V8 engine), non-blocking I/O suitable for network-bound operations
- Easy integration with MongoDB through Node.js ecosystem

**Alternatives Considered**:

- Python 3.11 + Django/FastAPI → More verbose, slower development for simple CRUD APIs
- Java/Spring Boot → Heavier setup, overhead for small team, slower development cycle
- Go/Gin → Steeper learning curve, smaller ecosystem

**Implementation**:

- Lock Node.js version via .nvmrc: `18`
- Use npm as package manager (installed with Node.js)
- Configure npm scripts in package.json for development/testing/deployment

---

### ✅ Decision 2: Express.js 4.x as Web Framework

**Decision**: Use Express.js 4.18.2 for REST API routing and middleware

**Rationale**:

- Minimal framework → fast to learn, small API surface
- Mature ecosystem: 15+ years, 50k+ GitHub stars, community tested
- Middleware pattern clean and composable (logging, auth, validation, error handling)
- Performance suitable for MVP (100-1000 concurrent users)
- Excellent documentation and StackOverflow community support

**Alternatives Considered**:

- Fastify → Slightly faster but overkill for MVP, smaller community
- Koa → Newer, cleaner async/await syntax but less ecosystem
- Hapi → More opinionated, larger framework, heavier for simple APIs

**Implementation**:

- Use Express.js 4.18.2 (not v5 beta due to stability)
- Middleware chain: Morgan (logging) → CORS → body-parser → authenticate → authorize → routes → 404 handler → error handler
- Organize routes by feature: authRoutes, courseRoutes, lessonRoutes, enrollmentRoutes, commentRoutes

---

### ✅ Decision 3: MongoDB 5.0+ with Mongoose 7.x ODM

**Decision**: Use MongoDB 5.0+ as primary data store, Mongoose 7.0.0 for schema validation and queries

**Rationale**:

- MongoDB: NoSQL flexibility for document-based e-learning data (courses, lessons, comments as documents)
- Mongoose: Schema enforcement prevents data corruption, relationship management, query helpers
- Version 7.0.0: Latest stable with TypeScript support, active maintenance
- Local MongoDB or MongoDB Atlas (cloud) both supported without code changes
- Ideal for rapid prototyping → can evolve schema without migrations

**Alternatives Considered**:

- PostgreSQL + Sequelize → More rigid schema, requires migrations, overkill for MVP
- Firebase/Firestore → Vendor lock-in, less control over data
- DynamoDB → AWS-specific, pricing model less predictable for MVP

**Implementation**:

- Local MongoDB instance for development (default connection: mongodb://localhost:27017/course-platform)
- Mongoose schemas for all 5 entities with field validation
- Indexes on frequently queried fields: courseId, studentId, instructorId
- Mongoose hooks for timestamps (createdAt, updatedAt)
- Connection pooling configured in config/database.js

---

### ✅ Decision 4: JWT (jsonwebtoken 9.0.0) for Stateless Authentication

**Decision**: Use JWT (JSON Web Tokens) for stateless authentication with 24-hour expiry

**Rationale**:

- Stateless authentication: no session storage needed, scales horizontally
- JWT payload includes userId and role for authorization on every request
- Industry standard (used by most modern APIs)
- Token expiry (24 hours) reasonable for MVP; refresh tokens added later if needed
- jsonwebtoken library: mature, production-ready, 10k+ stars

**Alternatives Considered**:

- Session/cookies → Requires session store, state coupling limits scalability
- OAuth2 → Overkill for internal API, more complexity (Phase 6 enhancement)
- API keys → Less flexible than JWT, harder to manage expiry/revocation

**Implementation**:

- JWT_SECRET stored in environment variable (never hardcoded)
- Token generation on login: `{ userId, role, expiresIn: '24h' }`
- Middleware validates token on every protected endpoint (authenticate.js)
- Token expiry returns 401 Unauthorized (user must login again)

---

### ✅ Decision 5: Joi 17.9.1 for Request Validation

**Decision**: Use Joi for schema-driven request validation on all endpoints

**Rationale**:

- Joi: Powerful schema validation library, clear error messages, reusable schemas
- Validation before business logic: prevents malformed data entering database
- Schema-driven approach enables documentation generation (OpenAPI integration later)
- Version 17.9.1: latest stable, active maintenance

**Alternatives Considered**:

- Manual validation → Error-prone, boilerplate code, inconsistent error messages
- TypeScript types → Only compile-time, no runtime validation
- Cerror → Simpler but less powerful, fewer features

**Implementation**:

- Centralized Joi schemas in /src/validators/ folder
- Separate validators: auth.js (register, login), course.js, lesson.js, enrollment.js, comment.js
- Validation middleware catches schema errors, returns 422 Unprocessable Entity
- Field-level error messages guide API clients on what was invalid

---

### ✅ Decision 6: bcrypt 5.1.0 for Password Hashing

**Decision**: Use bcrypt for password hashing with salt rounds ≥ 10

**Rationale**:

- bcrypt: adaptive hashing algorithm, deliberately slow to resist brute force attacks
- Salt rounds ≥ 10: ~100ms per hash, sufficient for MVP (can increase if needed)
- Industry standard, used by most platforms
- Version 5.1.0: latest stable, no known vulnerabilities

**Alternatives Considered**:

- Plaintext passwords → Security disaster (NEVER)
- MD5/SHA → Fast but unsuitable for passwords (vulnerable to rainbow tables)
- Argon2 → Stronger than bcrypt but more complex setup

**Implementation**:

- Password hashing on user registration (before database insert)
- Password comparison on login using bcrypt.compare()
- Never expose password hashes or plaintext passwords in API responses
- Salt rounds: 10 (~10 sec to hash; can increase to 12-13 in production if needed)

---

### ✅ Decision 7: Environment Configuration via dotenv and .env

**Decision**: Use dotenv for environment-based configuration (development vs production)

**Rationale**:

- 12-factor app principle: configuration via environment variables, not hardcoded values
- No sensitive data (JWT_SECRET, MONGODB_URI, database passwords) in source code
- Easy to change configuration without redeploying code
- Different .env files for dev/staging/production environments

**Alternatives Considered**:

- Hardcoded config files → Security risk, not portable
- Config management tools (Consul, etc.) → Overkill for MVP

**Implementation**:

- .env.example documents all required variables with descriptions
- .env.example checked into git; .env file gitignored
- Environment variables: PORT, NODE_ENV, MONGODB_URI, JWT_SECRET, JWT_EXPIRY, LOG_LEVEL, CORS_ORIGIN
- Application validates required variables on startup (throws if missing)

---

### ✅ Decision 8: ESLint 8.57.1 and Prettier 2.8.4 for Code Quality

**Decision**: Use ESLint for linting, Prettier for consistent code formatting

**Rationale**:

- ESLint: catches common bugs (unused variables, undefined references, etc.)
- Prettier: consistent formatting (indentation, line length, semicolons)
- Pre-commit hooks (husky + lint-staged): prevent committing bad code
- Easier team collaboration → everyone formats code the same way

**Implementation**:

- .eslintrc.json: 2-space indentation, single quotes, semicolons, no-console warnings
- .prettierrc.json: 2-space indentation, single quotes, 100-character line width
- npm scripts: `lint` (check), `lint:fix` (auto-fix), `format` (prettier)
- husky pre-commit hook runs lint-staged (eslint + prettier on changed files)

---

### ✅ Decision 9: Jest 29.5.0 for Testing

**Decision**: Use Jest for unit, integration, and e2e testing

**Rationale**:

- Jest: zero-config setup, built-in mocking, snapshot testing, coverage reporting
- Version 29.5.0: latest stable, active maintenance, widely adopted
- 80% code coverage threshold enforced for quality gates

**Alternatives Considered**:

- Mocha + Chai → Requires more setup, less built-in functionality
- Vitest → Newer but less ecosystem maturity

**Implementation**:

- jest.config.js: 80% coverage threshold, test environment (node), test file patterns
- Test structure: /tests/{unit, integration, e2e}/
- Test scripts: `test` (watch mode), `test:ci` (coverage report)

---

### ✅ Decision 10: MongoDB Connection Pooling and Error Handling

**Decision**: Use Mongoose connection pooling with retry logic and graceful shutdown

**Rationale**:

- Connection pooling: reuses connections, reduces overhead
- Retry logic: handles temporary connection failures
- Graceful shutdown: closes connections cleanly on SIGTERM/SIGINT

**Implementation**:

- Mongoose.connect() with { poolSize: 10 } option
- Error handlers: 'error', 'disconnect' events logged
- SIGTERM/SIGINT handlers close connections before process exit

---

### ✅ Decision 11: Morgan 1.10.0 for HTTP Request Logging

**Decision**: Use Morgan for HTTP request logging to console and files

**Rationale**:

- Morgan: de facto standard for Node.js HTTP logging
- Logs: timestamp, method, path, status code, response time
- Useful for debugging and monitoring API usage

**Implementation**:

- Morgan('dev') for development (colorized console output)
- Morgan('combined') for production with file logging (future enhancement)

---

### ✅ Decision 12: API Response Format (Consistent Contract)

**Decision**: All API responses follow consistent JSON structure: `{ success, data, pagination }`

**Rationale**:

- Predictable response structure helps frontend clients parse and handle responses
- Success flag (boolean) indicates success/failure at a glance
- Pagination metadata (limit, offset, total) sent with list endpoints
- Error responses: `{ success: false, error, code, details }`

**Implementation**:

- Response utility: `src/utils/response.js` with helpers
- Success: `{ success: true, data: {...}, pagination: {...} }`
- Error: `{ success: false, error: "...", code: "ERROR_CODE", details: {...} }`
- HTTP status codes: 2xx (success), 4xx (client error), 5xx (server error)

---

## Resolved Clarifications

| Item               | Initially           | Resolution                           | Confidence |
| ------------------ | ------------------- | ------------------------------------ | ---------- |
| Runtime            | NEEDS CLARIFICATION | Node.js 18 LTS                       | ✅ 100%    |
| Web Framework      | NEEDS CLARIFICATION | Express.js 4.x                       | ✅ 100%    |
| Database           | NEEDS CLARIFICATION | MongoDB 5.0+ + Mongoose 7.x          | ✅ 100%    |
| Authentication     | NEEDS CLARIFICATION | JWT stateless (24h expiry)           | ✅ 100%    |
| Validation         | NEEDS CLARIFICATION | Joi schema validation                | ✅ 100%    |
| Password Hashing   | NEEDS CLARIFICATION | bcrypt (salt rounds 10)              | ✅ 100%    |
| Config Management  | NEEDS CLARIFICATION | dotenv (.env files)                  | ✅ 100%    |
| Code Quality       | NEEDS CLARIFICATION | ESLint + Prettier + husky            | ✅ 100%    |
| Testing Framework  | NEEDS CLARIFICATION | Jest with 80% coverage               | ✅ 100%    |
| HTTP Logging       | NEEDS CLARIFICATION | Morgan HTTP logging                  | ✅ 100%    |
| Response Format    | NEEDS CLARIFICATION | Consistent API JSON contract         | ✅ 100%    |
| Connection Pooling | NEEDS CLARIFICATION | Mongoose pooling + graceful shutdown | ✅ 100%    |

---

## Best Practices & Rationale

### No Premature Optimization

- Single Node.js instance (Phase 1-4 adequate for 100-1000 concurrent users)
- Horizontal scaling (load balancing, multiple instances) added in Phase 8 if needed
- Direct Mongoose queries (no microservices/gRPC yet; monolithic API suitable for MVP)

### Security by Default

- JWT_SECRET and MONGODB_URI in environment variables (never hardcoded)
- Passwords hashed with bcrypt before storage
- Role-based access control on every protected endpoint
- No sensitive data in error responses (stack traces logged server-side only)

### Developer Experience

- ESLint + Prettier prevent formatting arguments
- Pre-commit hooks catch mistakes before commit
- Clear project structure mirrors feature domains
- Comprehensive documentation (README.md, POSTMAN_ENDPOINTS.md, quickstart.md)

### Scalability Path

- Middleware pattern allows adding caching, rate limiting, compression easily
- MongoDB scaling: sharding, replication, backup strategies
- API versioning: routes can be organized as /v1, /v2 for backwards compatibility
- Service extraction: controllers can become independent services later

---

**Status**: ✅ **All 12 Technology Decisions Documented and Justified**  
**Ready for**: Phase 1 Design (data-model.md, contracts/, quickstart.md)
