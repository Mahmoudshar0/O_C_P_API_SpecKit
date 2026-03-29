# Tasks: Phases 1-4 Core API Development and Implementation

**Feature**: Online Course Platform Backend API - Core Development  
**Feature ID**: 002  
**Branch**: `002-core-api-development`  
**Input**: Design documents from `/specs/002-core-api-development/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Contract and integration tests included - write these FIRST before implementation

**Organization**: Tasks grouped by user story to enable independent implementation and testing

---

## Format: `- [ ] [TaskID] [P?] [Story] Description with file path`

- **[P]**: Parallelizable task (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1, US2, US3, US4, US5, US6)
- **File paths**: Exact locationfor where code/tests belong

---

## Phase 1: Project Setup & Dependencies

**Purpose**: Initialize Node.js project with all required dependencies and folder structure

**Duration**: 1 day  
**Story**: US1 (Setup Environment)

- [x] T001 Create project folder structure per plan.md in src/ (models, controllers, routes, middlewares, validators, utils, config)
- [x] T002 [P] Initialize npm package.json with scripts: dev, start, test, lint, lint:fix, format (use plan.md package.json template)
- [x] T003 [P] Install 577+ production dependencies: express 4.18.2, mongoose 7.0.0, jsonwebtoken 9.0.0, bcrypt 5.1.0, joi 17.9.1, dotenv 16.0.3, morgan 1.10.0
- [x] T004 [P] Install dev dependencies: nodemon, eslint, prettier, jest 29.5.0, husky 8.0.3, lint-staged
- [x] T005 [P] Setup ESLint configuration (.eslintrc.json) with airbnb-base config for Node.js
- [x] T006 [P] Setup Prettier configuration (.prettierrc.json) with consistent formatting rules
- [x] T007 [P] Configure git hooks: .husky/pre-commit runs ESLint + Prettier + tests
- [x] T008 [P] Create .env.example template with all environment variables (PORT, NODE_ENV, MONGODB_URI, JWT_SECRET, LOG_LEVEL, CORS_ORIGIN)
- [x] T009 [P] Create .nvmrc with version "18" to lock Node.js 18 LTS
- [x] T010 [P] Create .gitignore excluding: node_modules/, .env, .DS_Store, \*.log, coverage/, dist/
- [x] T011 Create jest.config.js with test configuration: testEnvironment=node, collectCoverageFrom, coverage threshold 80%
- [x] T012 [P] Create src/config/environment.js to validate and export .env variables with defaults
- [x] T013 [P] Create src/config/database.js with Mongoose connection setup (MongoDB URI, connection options, error handling)
- [x] T014 Create src/index.js as server entry point: import app, connect db, start server on PORT
- [x] T015 Create README.md with setup instructions linking to quickstart.md

**Checkpoint**: npm install works, folder structure created, npm run dev starts empty server ✅

---

## Phase 2: Foundation - Shared Infrastructure (CRITICAL BLOCKING PHASE)

**Purpose**: Core infrastructure MUST complete before ANY user story implementation begins

**Duration**: 2 days  
**⚠️ CRITICAL**: No user story work can proceed until this phase is 100% complete

### Middleware & Helper Infrastructure

- [x] T016 Create src/utils/response.js: standardResponse(success, message, data, statusCode) function
- [x] T017 Create src/utils/jwt.js: generateToken(userId, role) and verifyToken(token) helper functions
- [x] T018 [P] Create src/middlewares/errorHandler.js: Express 4-param error handler returning { success: false, error, message, statusCode, details }
- [x] T019 [P] Create src/middlewares/authenticate.js: Extract JWT from Authorization header, verify, attach req.user (userId, role)
- [x] T020 [P] Create src/middlewares/authorize.js: Check req.user.role against allowed roles, return 401/403 as needed
- [x] T021 [P] Create src/middlewares/validate.js: Joi validation middleware (req, res, next) returning 422 with field errors on failure
- [x] T022 Create src/app.js: Express setup with Morgan → CORS → bodyParser → routes → errorHandler middleware stack

### Base Models (All 5 Collections)

- [x] T023 [P] Create src/models/User.js: Mongoose User schema (name, email, passwordHash, role, createdAt, updatedAt) with email unique index
- [x] T024 [P] Create src/models/Course.js: Mongoose Course schema (title, description, instructorId ref, category, createdAt, updatedAt) with instructorId index
- [x] T025 [P] Create src/models/Lesson.js: Mongoose Lesson schema (title, content, courseId ref, position, createdAt) with courseId+position compound index
- [x] T026 [P] Create src/models/Enrollment.js: Mongoose Enrollment schema (studentId ref, courseId ref, enrolledAt, progress) with compound unique (studentId, courseId)
- [x] T027 [P] Create src/models/Comment.js: Mongoose Comment schema (studentId ref, lessonId ref, content, createdAt) with lessonId index

**Checkpoint**: All 5 Mongoose models created and connected, db connection working, error handling middleware active ✅

---

## Phase 3: User Story 6 - Secure Authentication with JWT (Priority: P1)

**Goal**: Users register with email/password, authenticate via JWT tokens, access protected endpoints

**Independent Test**: Register → Login → Use token on protected endpoint → Verify 401 on expired/missing token

**Duration**: 1-1.5 days

### Contract Tests for Authentication (⚠️ Write tests FIRST)

- [ ] T028 [P] Create tests/contract/test_auth_register.js: Test POST /auth/register with valid/invalid inputs (201, 400, 409)
- [ ] T029 [P] Create tests/contract/test_auth_login.js: Test POST /auth/login with valid/invalid credentials (200, 401, 400)
- [ ] T030 [P] Create tests/contract/test_auth_refresh.js: Test POST /auth/refresh with valid/invalid tokens (200, 401)

### Validators for Authentication

- [ ] T031 Create src/validators/auth.js: Joi schemas for register (name/email/password/role) and login (email/password) with error messages

### Authentication Endpoints Implementation

- [ ] T032 Create src/controllers/authController.js with register(req, res) handler:
  - Validate input via Joi
  - Hash password with bcrypt (rounds: 10)
  - Create User model instance
  - Generate JWT token
  - Return 201 with token + user data
- [ ] T033 Create src/controllers/authController.js with login(req, res) handler:
  - Find user by email
  - Compare password with bcrypt.compare()
  - Generate JWT token on match
  - Return 200 with token + user data or 401
- [ ] T034 Create src/controllers/authController.js with refresh(req, res) handler:
  - Verify current token from Authorization header
  - Generate new token from decoded userId/role
  - Return 200 with new token or 401
- [ ] T035 Create src/routes/authRoutes.js: Define POST /auth/register, POST /auth/login, POST /auth/refresh routes (no middleware on register/login, authenticate on refresh)
- [ ] T036 Mount authRoutes in src/app.js under /api/auth prefix

**Integration Tests for Authentication**

- [ ] T037 Create tests/integration/test_auth_flow.js: Full registration → login → token usage → refresh flow

**Checkpoint**: Users can register, login, receive JWT, and use token to access protected endpoints ✅

---

## Phase 4: User Story 2 - Instructor Creates and Manages Courses (Priority: P1)

**Goal**: Instructors authenticate, create courses with metadata, retrieve course lists and details with pagination

**Independent Test**: Register as Instructor → Create course → List courses → Get course details → Verify student can view but not create

**Duration**: 1-1.5 days

**Dependencies**: Must complete Phase 3 (Authentication) first

### Contract Tests for Courses (⚠️ Write tests FIRST)

- [ ] T038 [P] Create tests/contract/test_courses_create.js: Test POST /courses with valid/invalid data, instructor/student roles (201, 400, 401, 403)
- [ ] T039 [P] Create tests/contract/test_courses_list.js: Test GET /courses with pagination, filters, sorting (200 with paginated results)
- [ ] T040 [P] Create tests/contract/test_courses_get.js: Test GET /courses/:courseId for valid/invalid IDs (200, 404, 400)
- [ ] T041 [P] Create tests/contract/test_courses_update.js: Test PUT /courses/:courseId with owner/other instructor/student (200, 403, 401)

### Validators for Courses

- [ ] T042 Create src/validators/course.js: Joi schemas for create (title, description, category, optional) and update (all fields optional) with error messages

### Course Endpoints Implementation

- [ ] T043 Create src/controllers/courseController.js with create(req, res) handler:
  - Authenticate + authorize (Instructor/Admin only via middleware)
  - Validate input via Joi
  - Create Course instance with instructorId from req.user.userId
  - Save to MongoDB
  - Return 201 with course data
- [ ] T044 Create src/controllers/courseController.js with list(req, res) handler:
  - Accept query params: page (default 1), limit (default 10, max 50), sortBy, order
  - Query Course.find() with pagination
  - Return 200 with paginated array + total count
- [ ] T045 Create src/controllers/courseController.js with get(req, res) handler:
  - Validate courseId format (MongoDB ObjectId)
  - Find and return 200 or 404
- [ ] T046 Create src/controllers/courseController.js with update(req, res) handler:
  - Authenticate (all users)
  - Authorize (course owner or admin only)
  - Validate input via Joi (partial validation for update)
  - Update Course instance
  - Return 200 with updated data or 403
- [ ] T047 Create src/routes/courseRoutes.js: Define POST /courses (private), GET /courses (public), GET /courses/:courseId (public), PUT /courses/:courseId (private) routes
- [ ] T048 Mount courseRoutes in src/app.js under /api/courses prefix

**Integration Tests for Courses**

- [ ] T049 Create tests/integration/test_courses_flow.js: Instructor creates course → student lists courses → student views details

**Checkpoint**: Instructors can create/update courses, students can view course catalog with pagination ✅

---

## Phase 5: User Story 3 - Student Enrolls in Courses (Priority: P1)

**Goal**: Students browse courses and enroll with unique enrollment tracking and progress initialization

**Independent Test**: Student registers → views course list → enrolls in course → views enrollment → unenroll → verify no duplicate enrollments

**Duration**: 1 day

**Dependencies**: Must complete Phase 3 (Auth) + Phase 4 (Courses) first

### Contract Tests for Enrollments (⚠️ Write tests FIRST)

- [ ] T050 [P] Create tests/contract/test_enrollments_create.js: Test POST /enrollments with valid course/already enrolled/non-existent course (201, 409, 404, 401)
- [ ] T051 [P] Create tests/contract/test_enrollments_list.js: Test GET /enrollments/my-courses for student (200 with student's enrollments)
- [ ] T052 [P] Create tests/contract/test_enrollments_get.js: Test GET /enrollments/:enrollmentId for own/other enrollment (200, 403, 404)
- [ ] T053 [P] Create tests/contract/test_enrollments_delete.js: Test DELETE /enrollments/:enrollmentId for own/other (200, 403, 404)

### Validators for Enrollments

- [ ] T054 Create src/validators/enrollment.js: Joi schema for enroll (courseId required, MongoDB ObjectId format)

### Enrollment Endpoints Implementation

- [ ] T055 Create src/controllers/enrollmentController.js with enroll(req, res) handler:
  - Authenticate required
  - Validate courseId via Joi
  - Check if course exists (404 if not)
  - Check if already enrolled (409 if true, unique constraint)
  - Create Enrollment instance with studentId from req.user.userId
  - Save to MongoDB
  - Return 201 with enrollment data
- [ ] T056 Create src/controllers/enrollmentController.js with listMyEnrollments(req, res) handler:
  - Authenticate required
  - Query Enrollments where studentId = req.user.userId
  - Populate course details via Mongoose populate()
  - Accept pagination params (page, limit)
  - Return 200 with paginated enrollments
- [ ] T057 Create src/controllers/enrollmentController.js with getEnrollment(req, res) handler:
  - Authenticate required
  - Authorize (own enrollment or admin)
  - Find Enrollment by ID, populate course + student details
  - Return 200 or 403/404
- [ ] T058 Create src/controllers/enrollmentController.js with unenroll(req, res) handler:
  - Authenticate required
  - Authorize (own enrollment or admin)
  - Delete Enrollment by ID
  - Return 200 with deletion confirmation or 403/404
- [ ] T059 Create src/routes/enrollmentRoutes.js: Define POST /enrollments (private), GET /enrollments/my-courses (private), GET /enrollments/:enrollmentId (private), DELETE /enrollments/:enrollmentId (private)
- [ ] T060 Mount enrollmentRoutes in src/app.js under /api/enrollments prefix

**Integration Tests for Enrollments**

- [ ] T061 Create tests/integration/test_enrollments_flow.js: Student enrolls → views own enrollments → unenroll → verify gone

**Checkpoint**: Students can enroll/view/manage course enrollments with duplicate prevention ✅

---

## Phase 6: User Story 4 - Instructor Adds Lessons to Courses (Priority: P1)

**Goal**: Instructors create lessons within courses with positioning, students view lessons ordered by position

**Independent Test**: Instructor creates course → adds 3 lessons with positions → student views lessons sorted correctly → verify instructor-only access

**Duration**: 1 day

**Dependencies**: Must complete Phase 3 (Auth) + Phase 4 (Courses) first

### Contract Tests for Lessons (⚠️ Write tests FIRST)

- [ ] T062 [P] Create tests/contract/test_lessons_create.js: Test POST /courses/:courseId/lessons for owner/other instructor/student (201, 403, 401)
- [ ] T063 [P] Create tests/contract/test_lessons_list.js: Test GET /courses/:courseId/lessons with sorting by position (200 with lessons sorted)

### Validators for Lessons

- [ ] T064 Create src/validators/lesson.js: Joi schemas for create (title, content, position all required, position > 0)

### Lesson Endpoints Implementation

- [ ] T065 Create src/controllers/lessonController.js with create(req, res) handler:
  - Authenticate required
  - Validate courseId format
  - Find course and verify instructor ownership (403 if not owner)
  - Validate input via Joi
  - Create Lesson instance with courseId
  - Save to MongoDB (compound unique index prevents duplicate positions)
  - Return 201 with lesson data
- [ ] T066 Create src/controllers/lessonController.js with listByCourse(req, res) handler:
  - Query Lessons where courseId = :courseId
  - Sort by position ascending
  - Auto populate course instructor details
  - Return 200 with lessons array
- [ ] T067 Create src/routes/lessonRoutes.js: Define POST /courses/:courseId/lessons (private), GET /courses/:courseId/lessons (public)
- [ ] T068 Mount lessonRoutes in src/app.js under /api/courses/ prefix

**Integration Tests for Lessons**

- [ ] T069 Create tests/integration/test_lessons_flow.js: Instructor creates course → adds lessons → student views lessons ordered

**Checkpoint**: Instructors can add lessons to courses, lessons appear ordered by position for all users ✅

---

## Phase 7: User Story 5 - Students Comment on Lessons (Priority: P2)

**Goal**: Students post questions/feedback on lessons, all users view comments in reverse chronological order

**Independent Test**: Student adds comment → views comment list → verify newest-first ordering

**Duration**: 0.5 day

**Dependencies**: Must complete Phase 3 (Auth) + Phase 6 (Lessons) first

### Contract Tests for Comments (⚠️ Write tests FIRST)

- [ ] T070 [P] Create tests/contract/test_comments_create.js: Test POST /lessons/:lessonId/comments for student/instructor (201, 403)
- [ ] T071 [P] Create tests/contract/test_comments_list.js: Test GET /lessons/:lessonId/comments with pagination, newest-first (200 with paginated comments)

### Validators for Comments

- [ ] T072 Create src/validators/comment.js: Joi schema for create (content required, 1-500 chars)

### Comment Endpoints Implementation

- [ ] T073 Create src/controllers/commentController.js with create(req, res) handler:
  - Authenticate required (students only via authorize middleware)
  - Validate lessonId format
  - Check if lesson exists (404 if not)
  - Validate input via Joi
  - Create Comment instance with studentId from req.user.userId, lessonId
  - Save to MongoDB
  - Return 201 with comment data
- [ ] T074 Create src/controllers/commentController.js with list(req, res) handler:
  - Query Comments where lessonId = :lessonId
  - Populate student name/email details
  - Sort by createdAt descending (newest first)
  - Accept pagination params (page, limit)
  - Return 200 with paginated comments
- [ ] T075 Create src/routes/commentRoutes.js: Define POST /lessons/:lessonId/comments (private), GET /lessons/:lessonId/comments (public)
- [ ] T076 Mount commentRoutes in src/app.js under /api/lessons/ prefix

**Integration Tests for Comments**

- [ ] T077 Create tests/integration/test_comments_flow.js: Student comments on lesson → views list ordered newest-first

**Checkpoint**: Students can comment on lessons, comments display in reverse chronological order ✅

---

## Phase 8: Cross-Cutting Concerns & Polish (P3 - DEFERRED)

**Purpose**: Code quality, documentation, performance optimization

**Duration**: 1 day (deferred to Phase 5+ after core endpoints working)

### Code Quality & Testing

- [ ] T078 Implement comprehensive unit tests for controllers in tests/unit/ (80% coverage target)
- [ ] T079 Add integration tests for complete user journeys in tests/integration/
- [ ] T080 Run jest with coverage report: `npm run test:ci`
- [ ] T081 Fix all ESLint violations: `npm run lint:fix`
- [ ] T082 Format all code: `npm run format`

### Documentation & API Reference

- [ ] T083 Generate per-endpoint documentation from contracts/ (auto-generate if tools available)
- [ ] T084 Create POSTMAN_ENDPOINTS.md Postman collection export with all 11 endpoints
- [ ] T085 Create API_REFERENCE.md with cURL examples for all endpoints
- [ ] T086 Document error codes and response format in API_ERRORS.md

### Performance & Optimization

- [ ] T087 Implement .lean() queries in read-only endpoints for 15%+ speed improvement
- [ ] T088 Add database indexes per data-model.md (verify via MongoDB explain)
- [ ] T089 Implement request logging with Morgan (inspect logs for slow endpoints)

---

## Phase 9: Final Testing & Verification (P3 - DEFERRED)

**Purpose**: End-to-end testing, manual verification, readiness for production

**Duration**: 1 day (deferred to Phase 5)

### System Testing

- [ ] T090 Manual testing: Register user (student + instructor) via Postman
- [ ] T091 Manual testing: Instructor creates course → adds lessons with comments
- [ ] T092 Manual testing: Student enrolls → views calendar correct lesson order
- [ ] T093 Manual testing: Student comments → verify newest-first display
- [ ] T094 Test JWT token expiry: verify 401 after 24 hours
- [ ] T095 Test role-based access: verify all 403 Forbidden responses for role violations
- [ ] T096 Load testing: simulate 100 concurrent users with Apache Bench or Artillery
- [ ] T097 Test MongoDB connection resilience: kill connection, verify auto-reconnect

### Deployment Readiness

- [ ] T098 Create .env.production with production values (strong JWT_SECRET, production MongoDB URI)
- [ ] T099 Verify all environment variables validated at startup
- [ ] T100 Document deployment steps in DEPLOYMENT.md

---

## Task Summary

| Phase                     | Tasks     | Duration   | Status         | Dependency    |
| ------------------------- | --------- | ---------- | -------------- | ------------- |
| Phase 1: Setup            | T001-T015 | 1 day      | 🟦 Next        | None          |
| Phase 2: Foundation       | T016-T027 | 2 days     | 🟦 After P1    | Phase 1 ✅    |
| Phase 3: Auth (US6)       | T028-T037 | 1-1.5 days | 🟦 After P2    | Phase 2 ✅    |
| Phase 4: Courses (US2)    | T038-T049 | 1-1.5 days | 🟦 Parallel P3 | Phase 2 ✅    |
| Phase 5: Enrollment (US3) | T050-T061 | 1 day      | 🟦 After P4    | Phases 3+4 ✅ |
| Phase 6: Lessons (US4)    | T062-T069 | 1 day      | 🟦 Parallel P5 | Phases 3+4 ✅ |
| Phase 7: Comments (US5)   | T070-T077 | 0.5 day    | 🟦 Parallel P6 | Phases 3+6 ✅ |
| Phase 8: Polish           | T078-T089 | 1 day      | 🟨 Deferred    | All core ✅   |
| Phase 9: Final Testing    | T090-T100 | 1 day      | 🟨 Deferred    | All core ✅   |

---

## Parallelization Opportunities

### Parallel Track 1: Setup & Foundation (Critical Path)

```
Phase 1 (Setup) → Phase 2 (Foundation) → Continue below
```

### Parallel Track 2: Authentication (US6)

```
After Phase 2 complete: T028-T037 (Auth endpoints) can run in parallel with:
```

### Parallel Track 3: Core Features (US2, US3, US4, US5)

```
After Auth complete:
- US2 (Courses): T038-T049 can run immediately
- US4 (Lessons): T062-T069 can run in parallel with US2
- US3 (Enrollment): T050-T061 can run after US2 (depends on courses)
- US5 (Comments): T070-T077 can run after US4 (depends on lessons)
```

**Example parallel execution** (after Phase 2):

1. Developer A: Implement Auth (T028-T037) - 1.5 days
2. Developer B: Implement Courses (T038-T049) - 1.5 days
3. Developer A (after Auth): Implement Comments (T070-T077) - 0.5 day
4. Developer B (after Courses): Implement Enrollment (T050-T061) - 1 day
5. Developer C (parallel to all): Implement Lessons (T062-T069) - 1 day

**Optimal team size**: 2-3 developers can complete all 7 phases in 5-7 days total wall-clock time

---

## MVP Scope (Minimum Viable Product)

**Core MVP** (Complete Phases 1-7 by end of week):

- ✅ All 11 REST endpoints functioning
- ✅ User registration + authentication
- ✅ Instructor course creation
- ✅ Student enrollment + course browsing
- ✅ Lesson viewing with ordering
- ✅ Student comments on lessons
- ✅ JWT token-based security
- ✅ Role-based access control (Instructor vs Student)
- ✅ MongoDB persistence
- ✅ Basic error handling + validation

**MVP Not Included** (Phase 8+):

- ❌ Advanced analytics (enrollment trends, completion rates)
- ❌ Student progress tracking (mark lessons complete)
- ❌ Certificate generation
- ❌ Discussion threads (comment threading)
- ❌ Search & filtering (added Phase 6)
- ❌ Rate limiting on auth endpoints (Phase 3+)
- ❌ Refresh tokens (24-hour tokens sufficient for MVP)

---

## Testing Requirements

### Test Pyramid (All Phases)

```
        🔺 E2E Tests (10%)
       /   \
      /     \ Integration Tests (30%)
     /       \
    /_________\ Unit Tests (60%)
```

- **Unit Tests** (60%): Controllers, validators, utils - T028, T038, etc. blocks
- **Integration Tests** (30%): Complete flows (auth → course → enroll) - T037, T049, T061, etc.
- **E2E Tests** (10%): Full Postman collection runs - Phase 9 manual testing

### Test Coverage Target: 80% by Phase 8

- Phase 1-7: Write contract + integration tests (T028+, T038+, etc.)
- Phase 8: Expand to 80% coverage with unit tests (T078)

---

## Success Criteria Checklist

### Phase 1 Complete ✅

- [ ] npm install successful, 577+ packages installed
- [ ] npm run dev starts server on port 5000
- [ ] Folder structure matches plan.md
- [ ] .env.example configured
- [ ] ESLint + Prettier configured
- [ ] Pre-commit hooks active

### Phase 2 Complete ✅

- [ ] All 5 Mongoose models created (User, Course, Lesson, Enrollment, Comment)
- [ ] Database connection working
- [ ] Error handling middleware active
- [ ] Validation middleware functional

### Phase 3 Complete ✅

- [ ] POST /auth/register works (201)
- [ ] POST /auth/login works (200, 401)
- [ ] POST /auth/refresh works (200, 401)
- [ ] JWT tokens valid 24 hours
- [ ] Protected endpoints require valid token (401 without)

### Phase 4 Complete ✅

- [ ] POST /courses works for Instructor (201, 403 for Student)
- [ ] GET /courses works with pagination (200)
- [ ] GET /courses/:courseId works (200, 404)
- [ ] PUT /courses/:courseId works for owner (200, 403)

### Phase 5 Complete ✅

- [ ] POST /enrollments works for Student (201, 409 duplicate)
- [ ] GET /enrollments/my-courses works (200)
- [ ] Student can unenroll (200, 403)

### Phase 6 Complete ✅

- [ ] POST /courses/:courseId/lessons works for Instructor (201, 403)
- [ ] GET /courses/:courseId/lessons works sorted by position (200)

### Phase 7 Complete ✅

- [ ] POST /lessons/:lessonId/comments works for Student (201, 403)
- [ ] GET /lessons/:lessonId/comments works paginated, newest-first (200)

### Everything Working ✅

- [ ] All 11 endpoints responding
- [ ] JWT auth functional
- [ ] RBAC enforced (403 on violations)
- [ ] Database persistent
- [ ] Validation working (422 on invalid)
- [ ] ESLint passing (0 errors)
- [ ] Tests passing (60%+ coverage)
- [ ] All users can complete their core workflows

---

**Total Task Count**: 100 tasks  
**Estimated Duration**: 5-7 days (2-3 developers, working in parallel)  
**Ready for Implementation**: ✅ YES

**Next Step**: Begin Phase 1 setup tasks (T001-T015) immediately
