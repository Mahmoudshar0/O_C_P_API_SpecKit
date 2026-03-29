---
description: 'Task list for Phase 0 - Foundation and Architecture implementation'
---

# Tasks: Phase 0 - Foundation and Architecture

**Input**: Design documents from `/specs/001-foundation-arch/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/  
**Status**: Ready for implementation

**Organization**: Tasks are grouped by phase to enable foundational work first, followed by independent user story implementation.

**Format**: `[ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and foundational configuration

- [x] T001 Create `.gitignore` excluding node_modules/, .env, dist/, logs/, coverage/
- [x] T002 [P] Initialize git repository and create initial commit configuration
- [x] T003 [P] Create `.env.example` with required environment variables (PORT, MONGODB_URI, JWT_SECRET, NODE_ENV, LOG_LEVEL)
- [x] T004 [P] Create `.eslintrc.json` with Node.js recommended rules and custom team preferences
- [x] T005 [P] Create `.prettierrc.json` with code formatting configuration (2-space indent, single quotes, semicolons)
- [x] T006 [P] Create `jest.config.js` with test framework configuration and coverage settings
- [x] T007 [P] Create project folder structure: `src/{config,controllers,middlewares,models,routes,validators}` and `tests/{unit,integration,e2e}`
- [x] T008 [P] Create `README.md` with project overview, setup instructions, and API documentation links

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story work begins

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create `package.json` with npm scripts: `start`, `dev`, `test`, `test:ci`, `lint`, `lint:fix`, `format`
- [x] T010 Install npm dependencies: express, mongoose, dotenv, jsonwebtoken, joi, bcrypt, cors, morgan
- [x] T011 [P] Install npm dev dependencies: nodemon, eslint, prettier, jest, supertest, husky, lint-staged
- [x] T012 [P] Create `src/config/database.js` with MongoDB connection setup using Mongoose (connect function with error handling)
- [x] T013 [P] Create `src/middlewares/errorHandler.js` with Express error handling middleware (catches errors, logs, returns semantic HTTP responses)
- [x] T014 [P] Create `src/middlewares/index.js` exporting all middleware modules
- [x] T015 Create `src/app.js` with Express app instance, body-parser, CORS, Morgan logging middleware configuration
- [x] T016 Create `src/index.js` as entry point: loads environment config, initializes Express app, starts server listening
- [x] T017 Configure git hooks with husky + lint-staged for pre-commit linting and formatting
- [x] T018 Create `.npmrc` or configure npm to use compatible versions for all dependencies

**Checkpoint**: Foundation ready—server can start, health check responds, all middleware configured. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Initialize Node.js Project with Dependencies (Priority: P1) 🎯

**Goal**: Complete Node.js project setup with all required npm packages installed and verified

**Independent Test**: Run `npm install`, verify exit code 0, execute `npm list` confirming all core packages present (express, mongoose, joi, jsonwebtoken, bcrypt), check `node --version` ≥ 18

- [ ] T019 [US1] Verify `node --version` outputs Node.js 18 LTS or higher; document minimum version in README.md
- [ ] T020 [US1] Verify `npm install` completes without errors; all dependencies resolve to compatible versions
- [ ] T021 [US1] Create `package-lock.json` by running `npm install` and commit to git repository
- [ ] T022 [US1] [P] Verify `npm list` shows all core dependencies installed: express 4.x, mongoose 6.x+, jsonwebtoken, joi, bcrypt, dotenv, cors, morgan
- [ ] T023 [US1] [P] Create `.nvmrc` file documenting Node.js 18 LTS version for developers using nvm

---

## Phase 4: User Story 2 - Set Up Project Folder Structure (Priority: P1) 🎯

**Goal**: Establish MVC folder structure providing clear organization for all code layers

**Independent Test**: Verify all required directories exist: `src/{models,controllers,routes,middlewares,validators,config}`, `tests/{unit,integration,e2e}`; confirm developers can identify where to place new files

- [ ] T024 [US2] Create directory structure: `mkdir -p src/{config,controllers,middlewares,models,routes,validators}`
- [ ] T025 [US2] [P] Create test directory structure: `mkdir -p tests/{unit,integration,e2e}`
- [ ] T026 [US2] [P] Create `.gitkeep` files in empty directories to ensure git tracks folder structure
- [ ] T027 [US2] [P] Document folder structure in `README.md` with clear explanations of each directory purpose
- [ ] T028 [US2] [P] Create initial index.js files in each module directory (models, controllers, routes, middlewares, validators) exporting empty modules
- [ ] T029 [US2] Create `src/index.js` as the main application entry point (documented in Phase 2 T016, verify integration)

---

## Phase 5: User Story 3 - Configure Environment Variables and .env Setup (Priority: P2)

**Goal**: Implement secure environment variable management ensuring no hardcoded secrets in source code

**Independent Test**: Create `.env` file with sample values, verify `process.env.PORT`, `process.env.MONGODB_URI`, `process.env.JWT_SECRET` load correctly; confirm `.env` is in `.gitignore`

- [ ] T030 [US3] Create `.env.example` documenting all required variables: PORT (default 5000), NODE_ENV (development/production), MONGODB_URI (connection string), JWT_SECRET (min 32 chars), JWT_EXPIRY (24h), LOG_LEVEL (debug/info/warn/error)
- [ ] T031 [US3] [P] Verify `.env` is added to `.gitignore` to prevent accidental secret commits
- [ ] T032 [US3] [P] Create `src/config/environment.js` validating required environment variables on startup; throw error with clear message if any missing
- [ ] T033 [US3] Create integration in `src/index.js` to load environment variables using `require('dotenv').config()` BEFORE any other requires
- [ ] T034 [US3] [P] Document environment variable setup in `quickstart.md` or `README.md`: copy .env.example, customize, restart server
- [ ] T035 [US3] [P] Create test case: verify server startup fails with clear error message if required environment variable missing (e.g., JWT_SECRET absent)

---

## Phase 6: User Story 4 - Scaffold Express.js Server with Basic Middleware (Priority: P2)

**Goal**: Create working Express.js server with essential middleware and health check endpoint responding within 200ms

**Independent Test**: Start server (`npm run dev`), make GET request to `/health`, verify 200 status and `{ status: "ok" }` response; test POST with JSON payload, confirm body-parser parses correctly

- [ ] T036 [US4] Verify `src/app.js` exports Express application with middleware configured in correct order: logging (Morgan) → CORS → body-parser → routes → error handler
- [ ] T037 [US4] [P] Implement health check endpoint `GET /health` in `src/app.js` returning `{ status: "ok", timestamp: ISO8601, uptime: seconds }` with 200 status
- [ ] T038 [US4] [P] Configure Morgan logging middleware with 'dev' format for development environment
- [ ] T039 [US4] [P] Configure express.json() body-parser middleware to accept and parse JSON payloads
- [ ] T040 [US4] [P] Configure CORS middleware with default permissive settings (allow all origins for Phase 0; restrict in Phase 1+)
- [ ] T041 [US4] Create error handling middleware in `src/middlewares/errorHandler.js` catching all errors, logging context, returning JSON error response with semantic HTTP status
- [ ] T042 [US4] Implement 404 handler middleware in `src/app.js` for undefined routes returning `{ success: false, error: "Route not found", code: "NOT_FOUND" }`
- [ ] T043 [US4] [P] Verify server startup time is < 5 seconds by measuring `npm run dev` execution
- [ ] T044 [US4] [P] Verify health check endpoint response time < 200ms using curl or similar timing tool
- [ ] T045 [US4] Add npm script in `package.json`: `"dev": "nodemon src/index.js"` for development with auto-restart
- [ ] T046 [US4] Document server startup instructions in `README.md` and `quickstart.md` with example commands

---

## Phase 7: Polish & Quality Assurance

**Purpose**: Ensure code quality, validation, and documentation

- [x] T047 Run `npm run lint` to check for code quality issues; fix any violations
- [x] T048 Run `npm run format` to auto-format all source code using Prettier
- [x] T049 Verify all source files follow ESLint rules; no warnings or errors
- [ ] T050 [P] Test health endpoint: `curl http://localhost:5000/health` returns valid JSON with 200 status
- [ ] T051 [P] Test 404 handling: `curl http://localhost:5000/nonexistent` returns error JSON with 404 status
- [ ] T052 [P] Test CORS headers: verify CORS middleware adds appropriate headers to responses
- [x] T053 [P] Verify `.env.example` contains all environment variables with sensible placeholder values
- [x] T054 Create initial git commit with all Phase 0 artifacts: project structure, package.json, configuration files, Express scaffold, documentation
- [ ] T055 [P] Verify README.md includes: project description, prerequisites, setup instructions, development commands, troubleshooting, resources

---

## Dependencies & Parallel Execution

### Task Execution Order

**Must complete sequentially**:

1. Phase 1 (T001-T008): Setup foundation
2. Phase 2 (T009-T018): Install dependencies, create core infrastructure
3. Phase 3-6 (T019-T046): User stories can run in PARALLEL after Phase 2
   - **US1 tasks (T019-T023)**: Parallel with US2, US3, US4
   - **US2 tasks (T024-T029)**: Parallel with US1, US3, US4
   - **US3 tasks (T030-T035)**: Parallel with US1, US2, US4
   - **US4 tasks (T036-T046)**: Parallel with US1, US2, US3
4. Phase 7 (T047-T055): Quality checks, final verification

### Parallel Execution Example (After Phase 2 Complete)

```bash
# Terminal 1: User Story 1 tasks
npm install && npm list

# Terminal 2: User Story 2 tasks (separate terminal)
mkdir -p src/{config,controllers,...} tests/{unit,integration,e2e}

# Terminal 3: User Story 3 tasks (separate terminal)
cp .env.example .env && npm run dev

# Terminal 4: User Story 4 tasks (separate terminal)
curl http://localhost:5000/health
```

All three user story groups can proceed simultaneously; they don't block each other.

---

## Acceptance Criteria by User Story

### US1: Node.js Project Initialization

✅ Complete when:

- Node.js 18+ detected
- `npm install` completes without errors
- All core packages (express, mongoose, joi, jwt, bcrypt) installed
- `package-lock.json` committed to git

### US2: Project Folder Structure

✅ Complete when:

- All MVC directories exist: `src/{config,controllers,middlewares,models,routes,validators}`
- All test directories exist: `tests/{unit,integration,e2e}`
- Structure documented in README
- Developers can identify correct placement for new code

### US3: Environment Configuration

✅ Complete when:

- `.env.example` documented with all variables
- `.env` in `.gitignore`
- Environment validation on startup
- Server fails gracefully if required variables missing
- No secrets hardcoded in any source file

### US4: Express Server Scaffold

✅ Complete when:

- Server starts with `npm run dev`
- `/health` endpoint responds with 200 and JSON
- Response time < 200ms
- Morgan logging middleware captures requests
- Error handler catches and logs errors
- Body-parser parses JSON correctly
- CORS middleware configured
- 404 handler for undefined routes

---

## Testing Strategy

### Phase 0 Testing (No unit tests written yet)

- Manual testing of endpoints via curl or Postman
- Verify server startup and health check
- Confirm environment variables load correctly
- Test CORS headers and 404 handling
- Performance verification: startup < 5s, health check < 200ms

### Phase 1+ Testing (TDD begins)

- Unit tests for middleware functions
- Integration tests for Express app with database
- Contract tests for all API endpoints
- Test coverage minimum 80% per constitution

---

## Success Metrics

On Phase 0 completion:

- ✅ Server starts successfully: `npm run dev` → listening on PORT
- ✅ Health check responds: `GET /health` → 200 OK with JSON
- ✅ All dependencies installed: `npm list` → all packages present
- ✅ Project structure ready: MVC folders exist and documented
- ✅ Environment configured: `.env` setup, secrets not hardcoded
- ✅ No linting errors: `npm run lint` → 0 violations
- ✅ Code formatted: `npm run format` applied
- ✅ Documentation complete: README.md, quickstart.md updated
- ✅ Git initialized: All artifacts committed

**Phase 0 enables Phase 1** (database models, authentication endpoints) to proceed without infrastructure blockers.
