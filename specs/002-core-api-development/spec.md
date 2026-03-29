# Feature Specification: Phases 1-4 - Core API Development and Implementation

**Feature Name**: Online Course Platform Backend API - Core Development  
**Feature ID**: 002  
**Feature Branch**: `002-core-api-development`  
**Created**: March 29, 2026  
**Status**: 🟨 Ready for Implementation

## Executive Summary

This specification covers **Phases 1-4 of the Online Course Platform Backend development**, encompassing requirement analysis through core feature implementation. The feature delivers a complete REST API backend built with Node.js, Express.js, and MongoDB, enabling an e-learning platform where instructors manage courses and students engage with educational content.

**Scope**:

- Requirement Analysis & Planning (Phase 1)
- System Design - Database & API Design (Phase 2)
- Environment Setup - Dependencies & Project Structure (Phase 3)
- Core Development - Implementation of all 11 API endpoints (Phase 4)

---

## User Scenarios & Testing _(mandatory)_

### User Story 1: Backend Developer Sets Up Development Environment (Priority: P1)

**Description**: Backend developer configures a fully operational Node.js development environment with all dependencies, folder structure, and pre-commit hooks to begin Phase 4 development.

**Why this priority**: Without a proper development environment (P1), no development work can proceed. This is the foundational prerequisite for all subsequent work.

**Independent Test**: Can be fully tested by running `npm install`, verifying folder structure, and executing `npm run dev` - delivers immediate value of a ready-to-use development machine.

**Acceptance Scenarios**:

1. **Given** developer clones repository, **When** running `npm install`, **Then** 577+ packages installed with zero errors
2. **Given** folder structure exists, **When** developer runs `npm run dev`, **Then** server starts on port 5000 with no errors
3. **Given** code edited with linting violations, **When** attempting to commit, **Then** pre-commit hooks block commit and require fixes
4. **Given** `.env.example` file exists, **When** developer copies to `.env` and adds MONGODB_URI, **Then** server can connect to database

---

### User Story 2: Instructor Creates and Manages Courses (Priority: P1)

**Description**: Instructors authenticate, then create courses with title, description, and optional category. Instructors can retrieve their own courses and view course details.

**Why this priority**: Course creation is core platform value (P1) - without courses, there is no platform. Students and instructors depend on this functionality.

**Independent Test**: Can be fully tested by registering as Instructor → creating course → retrieving course list - delivers complete course management workflow.

**Acceptance Scenarios**:

1. **Given** instructor authenticated with JWT token, **When** POST `/courses` with valid title/description, **Then** 201 Created with course data
2. **Given** non-instructor user, **When** POST `/courses`, **Then** 403 Forbidden
3. **Given** courses exist, **When** GET `/courses?limit=10`, **Then** paginated list returned with total count
4. **Given** valid courseId, **When** GET `/courses/:courseId`, **Then** 200 with full course details

---

### User Story 3: Student Enrolls in Courses (Priority: P1)

**Description**: Students authenticate, browse available courses, and enroll in courses to begin learning.

**Why this priority**: Student enrollment is core value (P1) - shows students' intent to learn and enables progress tracking.

**Independent Test**: Can be fully tested by registering as Student → viewing course list → enrolling in course - delivers complete enrollment workflow.

**Acceptance Scenarios**:

1. **Given** authenticated student, **When** POST `/courses/:courseId/enroll`, **Then** 201 Created with enrollment data
2. **Given** student already enrolled, **When** POST `/courses/:courseId/enroll` again, **Then** 409 Conflict (prevents duplicate)
3. **Given** Instructor user, **When** POST `/courses/:courseId/enroll`, **Then** 403 Forbidden (students only)
4. **Given** non-existent courseId, **When** POST `/courses/:courseId/enroll`, **Then** 404 Not Found

---

### User Story 4: Instructor Adds Lessons to Courses (Priority: P1)

**Description**: Instructors add lessons to their courses with title, content, and position. Lessons appear in course in correct order.

**Why this priority**: Lessons are the actual course content (P1) - without lessons, courses are empty shells with no educational value.

**Independent Test**: Can be fully tested by Instructor creating course → adding lesson → student viewing lesson - delivers complete content delivery workflow.

**Acceptance Scenarios**:

1. **Given** Instructor owns course, **When** POST `/courses/:courseId/lessons` with title/content/position, **Then** 201 Created
2. **Given** Instructor does not own course, **When** POST `/courses/:courseId/lessons`, **Then** 403 Forbidden
3. **Given** course has multiple lessons, **When** GET `/courses/:courseId/lessons`, **Then** returned sorted by position ascending
4. **Given** valid lessonId, **When** student views lesson, **Then** can see full content

---

### User Story 5: Students Comment on Lessons (Priority: P2)

**Description**: Students post questions/comments on lessons. All users can view lesson comments in chronological order.

**Why this priority**: Commenting enables interaction (P2), valuable but not essential for MVP. Comments support community without blocking content delivery.

**Independent Test**: Can be fully tested by registering as Student → viewing lesson → posting comment → viewing comment list - delivers comment interaction workflow.

**Acceptance Scenarios**:

1. **Given** authenticated student viewing lesson, **When** POST `/lessons/:lessonId/comments` with content, **Then** 201 Created
2. **Given** Instructor, **When** POST `/lessons/:lessonId/comments`, **Then** 403 Forbidden (students only)
3. **Given** lesson has comments, **When** GET `/lessons/:lessonId/comments`, **Then** paginated list returned, newest first
4. **Given** comment text invalid, **When** POST with empty or oversized content, **Then** 422 Unprocessable Entity

---

### User Story 6: Secure Authentication with JWT (Priority: P1)

**Description**: Users register with email/password and authenticate. System issues JWT tokens for API access. Tokens expire after 24 hours.

**Why this priority**: Authentication is foundational security requirement (P1) - all other features depend on verified user identity.

**Independent Test**: Can be fully tested by registration → login → using token → attempting request without token - delivers complete auth workflow.

**Acceptance Scenarios**:

1. **Given** new user, **When** POST `/auth/register` with name/email/password/role, **Then** 201 Created and JWT token returned
2. **Given** duplicate email, **When** POST `/auth/register`, **Then** 409 Conflict
3. **Given** registered user, **When** POST `/auth/login` with correct credentials, **Then** 200 OK and JWT token returned
4. **Given** wrong password, **When** POST `/auth/login`, **Then** 401 Unauthorized

---

### Edge Cases

- What happens when student tries to enroll in non-existent course? → System returns 404 Not Found
- How does system handle password that's too short (< 8 chars)? → Validation error 422 Unprocessable Entity
- What happens when lesson position is negative or zero? → Validation error or normalized to valid range
- How does system handle duplicate comment postings (same content twice)? → Allowed - users can comment multiple times
- What happens when JWT token expires? → Resources return 401 Unauthorized, user must login again

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST support user registration via POST `/auth/register` accepting name, email, password, role
- **FR-002**: System MUST support user login via POST `/auth/login` accepting email, password and returning JWT token
- **FR-003**: System MUST hash passwords using bcrypt and never store plaintext passwords
- **FR-004**: System MUST validate JWT tokens on all protected endpoints and return 401 if invalid
- **FR-005**: System MUST enforce role-based access control: Instructors can create courses, Students can enroll and comment
- **FR-006**: System MUST allow instructors to create courses via POST `/courses` with title, description, optional category
- **FR-007**: System MUST return paginated course list via GET `/courses` with limit/offset query parameters
- **FR-008**: System MUST allow retrieving specific course via GET `/courses/:courseId` with full details
- **FR-009**: System MUST allow instructors to add lessons via POST `/courses/:courseId/lessons` with title, content, position
- **FR-010**: System MUST return lessons for a course sorted by position via GET `/courses/:courseId/lessons`
- **FR-011**: System MUST allow students to enroll in courses via POST `/courses/:courseId/enroll` with unique constraint (no duplicates)
- **FR-012**: System MUST allow students to comment on lessons via POST `/lessons/:lessonId/comments` with content
- **FR-013**: System MUST return paginated lesson comments via GET `/lessons/:lessonId/comments` with limit/offset pagination
- **FR-014**: System MUST validate all input using Joi schemas and return 422 with field-specific error messages
- **FR-015**: System MUST persist all data to MongoDB with proper relationships (instructorId, courseId, studentId references)

### Key Entities _(include if feature involves data)_

- **User**: Represents platform users with name, email, hashed password, role (Instructor/Student), timestamps
- **Course**: Represents courses created by Instructors with title, description, instructorId reference, category, timestamps
- **Lesson**: Represents course content with title, content, courseId reference, position for ordering, timestamps
- **Enrollment**: Represents student participation with studentId, courseId, enrolledAt timestamp, progress tracking
- **Comment**: Represents student interactions with content, studentId, lessonId, comment text, timestamps

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Development environment operational - npm install completes with 577+ packages, npm run dev starts server < 5 seconds
- **SC-002**: All 11 API endpoints implemented and returning correct HTTP status codes (201 for create, 200 for read, 401 for auth errors)
- **SC-003**: Authentication working - users can register, login, receive JWT token, and use token to access protected endpoints
- **SC-004**: Role-based access control enforced - Student can't POST /courses (403), Instructor can't POST /enroll (403)
- **SC-005**: All request data validated - invalid data returns 422 with field-specific error messages
- **SC-006**: Database operations functioning - all CRUD operations persist correctly to MongoDB with no data loss
- **SC-007**: Pagination implemented - GET endpoints support limit/offset parameters and return total count
- **SC-008**: Code quality gates passing - ESLint 0 errors, Prettier formatting 100% compliant, pre-commit hooks active

---

## Assumptions

- **A1**: JWT 24-hour expiry is reasonable default for Phase 1-4 MVP; refresh tokens can be added later
- **A2**: Local MongoDB instance (v5.0+) is available; cloud MongoDB Atlas supported without code changes
- **A3**: Single Node.js instance adequate for Phase 1-4; horizontal scaling/load balancing added in Phase 8
- **A4**: Email is primary unique identifier; username-based authentication can be added in future phases
- **A5**: Comments displayed newest-first; like/upvote systems added as Phase 6 enhancement features
- **A6**: Enrollment progress initialized to 0%; autoprogression logic refined in Phase 5 based on interaction tracking
- **A7**: CORS configured for single frontend origin (e.g., localhost:3000); multi-origin support added later as needed
- **A8**: Joi validation handles input sanitization; additional XSS protection via CSP headers added in Phase 5/6
- **A9**: Error messages user-friendly and non-technical; stack traces logged server-side but never exposed to client
