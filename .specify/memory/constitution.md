<!--
SYNC IMPACT REPORT
=================
Version: 0.0.0 → 1.0.0 (MINOR)
Rationale: Initial constitution creation for Online Course Platform backend API
Status: DRAFT

Principles Added (7):
- I. API-First Design
- II. Security & Authentication (JWT + RBAC)
- III. Data Validation with Joi
- IV. Test-Driven Development (NON-NEGOTIABLE)
- V. Database Integrity (MongoDB)
- VI. Error Handling & Observability
- VII. Simplicity & Scalability

Additional Sections:
- Technology Stack Requirements
- Development Workflow & Code Review
- Governance

Dependent Templates Requiring Alignment:
- ✅ plan-template.md: API endpoints + DB design align with principles
- ✅ spec-template.md: Must include security, validation, error handling criteria
- ⚠ tasks-template.md: Test tasks should be mandatory for every user story
- ⚠ commands/*.md: Verify no outdated references

Follow-up TODOs: None - all placeholders filled
-->

# Online Course Platform Backend API Constitution

## Core Principles

### I. API-First Design

Every feature MUST expose a clear, RESTful endpoint contract before implementation begins. All API endpoints MUST follow REST conventions: `GET` for retrieval, `POST` for creation, `PUT` for updates, `DELETE` for removal.

- **Non-negotiable**: Endpoint contracts must be documented in `/specs/[feature]/contracts/` before coding.
- **Required**: Request/response schemas must be formally defined (JSON schema or similar).
- **Format**: Use JSON exclusively for request and response bodies.
- **Rationale**: Clear contracts enable parallel frontend/backend development and catch design errors early.

---

### II. Security & Authentication (JWT + RBAC)

All endpoints MUST enforce authentication via JWT tokens and role-based access control (RBAC). Two roles defined: **Instructor** and **Student**, each with explicitly documented permissions.

- **Non-negotiable**: No endpoint bypasses authentication unless explicitly documented as public.
- **Tokens**: JWT tokens include `userId`, `role`, and `expiresAt` claims.
- **Authorization middleware**: Must check role-based permissions on every protected endpoint.
- **Secrets**: Environment-based (`.env`); never hardcoded. Use `process.env.JWT_SECRET`.
- **Rationale**: Prevents unauthorized access and ensures data isolation between user roles.

---

### III. Data Validation with Joi

All incoming request data MUST be validated using Joi schemas BEFORE business logic execution. No validation = no request processing.

- **Non-negotiable**: Every endpoint has a dedicated Joi schema in `/src/validators/`.
- **Required**: Schemas validate: type, length, format (email, URL, etc.), required vs. optional fields.
- **Error handling**: Validation errors return 400 status with clear field-level messages.
- **Reusability**: Common schemas (e.g., user registration) are centralized and reused.
- **Rationale**: Prevents malformed data from entering the database and reduces downstream bugs.

---

### IV. Test-Driven Development (NON-NEGOTIABLE)

Every feature MUST follow TDD: tests written → approved by lead → tests run (red) → implementation → tests pass (green) → refactor.

- **Mandatory**: Unit tests for all controllers, services, and model validators.
- **Integration tests**: Required for authentication flows, role permissions, and data constraints.
- **Coverage target**: Minimum 80% code coverage per feature.
- **Test structure**: `/tests/unit/` for units, `/tests/integration/` for integration, `/tests/e2e/` for end-to-end.
- **Rationale**: Catches regressions early, documents expected behavior, enables safe refactoring.

---

### V. Database Integrity (MongoDB)

All database operations MUST maintain ACID-like guarantees within MongoDB constraints. Mongoose schemas enforce field types, required fields, and references. No direct MongoDB operations bypass schema validation.

- **Non-negotiable**: All models defined in `/src/models/` using Mongoose; no direct driver calls.
- **Migrations**: Schema changes require versioned migration files in `/src/db/migrations/`.
- **Indexes**: High-query fields (e.g., `courseId`, `studentId`) MUST be indexed; document in model comments.
- **Relationships**: Use Mongoose `populate()` for references; validate foreign keys at schema level.
- **Rationale**: Consistent schemas prevent data corruption and enable reliable queries.

---

### VI. Error Handling & Observability

All errors MUST be caught, logged, and returned to clients with meaningful context. Structured logging enables debugging in production. No silent failures—every error is tracked.

- **HTTP Status Codes**: Use semantically correct codes: 400 (bad request), 401 (auth), 403 (forbidden), 404 (not found), 500 (server error).
- **Error responses**: JSON with format: `{ error: string, code: string, details: object }`.
- **Logging**: Structured logs (JSON) with level (error, warn, info), timestamp, userId, endpoint, stack trace.
- **Observability**: Track request count, latency, error rates per endpoint (use Morgan + Winston or similar).
- **Rationale**: Enables rapid incident response, helps identify systemic issues, aids debugging.

---

### VII. Simplicity & Scalability

Start simple: favor straightforward, maintainable code over premature optimizations. Scale only when profiling shows bottleneck; use caching, indexing, and pagination strategically.

- **YAGNI rule**: Do not add features not yet required (no 'future-proofing' without evidence).
- **Code clarity**: Variables, functions, and modules have single, clear responsibilities.
- **Pagination**: Endpoints returning collections MUST support `limit` and `offset` query parameters.
- **Caching**: Cache rarely-changing data (e.g., course descriptions) in memory or Redis; invalidate on update.
- **Rationale**: Reduces bugs, speeds up feature delivery, keeps codebase maintainable.

---

## Technology Stack Requirements

All development MUST use this approved stack:

- **Runtime**: Node.js 18+ (LTS recommended)
- **Web Framework**: Express.js 4.x
- **Database**: MongoDB 5.0+ with Mongoose 6.x+ ODM
- **Authentication**: jsonwebtoken (JWT)
- **Validation**: Joi (schema validation)
- **Hashing**: bcrypt (password hashing, never plain text)
- **Environment Config**: dotenv (never hardcode secrets)
- **Logging**: Morgan (HTTP request logging) + Winston or equivalent (app logging)
- **Testing**: Jest or Mocha + Chai (TDD mandatory)

Deviations require written architecture review and approval.

---

## Development Workflow & Code Review

All code changes flow through this workflow:

1. **Branch naming**: `[###-feature-name]` where `###` is the task/issue ID; branches must link to specs.
2. **Commits**: Each commit MUST be atomic and include a semantic message (feat:, fix:, test:, docs:, refactor:).
3. **Pull requests**: All PRs MUST include:
   - Reference to spec and task
   - Summary of changes
   - Test results (unit + integration)
   - Code coverage report
4. **Code review**: All non-trivial changes require peer review; reviewers verify compliance with constitution.
5. **Tests must pass**: No PR merges unless 100% of tests pass and coverage ≥ 80%.
6. **Merge strategy**: Squash or rebase to keep history clean.

---

## Governance

**This constitution supersedes all other development practices.** It is the source of truth for engineering decisions.

- **Compliance verification**: Every PR review includes a checklist to verify adherence to all seven principles and technology stack rules.
- **Amendments**: Changes to this constitution require written justification, migration plan, and approval by the project lead.
- **Versioning**: Follow semantic versioning (MAJOR.MINOR.PATCH):
  - MAJOR: Principle removal or backward-incompatible redefinition (requires stakeholder approval).
  - MINOR: New principle, principle expansion, or technology stack addition.
  - PATCH: Clarifications, wording, or non-semantic refinements.
- **Runtime guidance**: Developers follow this constitution AND the guidance in `.specify/` files (plan, spec, tasks) for daily execution.

**Constitution Check Gate**: Every feature plan MUST verify compliance with all principles before Phase 1 design begins.

---

**Version**: 1.0.0 | **Ratified**: 2026-03-29 | **Last Amended**: 2026-03-29
