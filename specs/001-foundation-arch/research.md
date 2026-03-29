# Research & Dependency Analysis: Phase 0

**Status**: Complete  
**Date**: 2026-03-29  
**Purpose**: Document decisions about technology stack, best practices, and dependency selections for foundation phase

---

## 1. Node.js Version Selection

**Decision**: Node.js 18 LTS (Long-Term Support) or higher

**Rationale**:

- LTS releases provide 18 months of active support and 12 months of maintenance
- Node.js 18 (released April 2022) has mature async/await and module support
- Stable JavaScript module ecosystem (CommonJS and ESM)
- Broad hosting provider support across all major cloud platforms (AWS, Azure, GCP, Heroku)

**Alternatives Considered**:

- Node.js 20 LTS (released 2023): Future-proof but less critical for foundation phase
- Node.js 16 LTS: Still supported but approaching end-of-life (September 2023 → September 2026)
- Node.js latest: Unnecessary risk; new features arrive via dependencies

**Best Practices**:

- Pin Node.js version in `.nvmrc` file for reproducible developer environments
- Use `nvm` (Node Version Manager) for local development to switch versions easily
- Document minimum Node.js requirement clearly in README

---

## 2. Express.js Version Selection

**Decision**: Express.js 4.x (latest stable in 4.x series)

**Rationale**:

- Industry standard for Node.js REST APIs (used by thousands of production apps)
- Mature, well-documented, large community
- Extensive middleware ecosystem for logging, auth, CORS, body parsing
- Lightweight—doesn't impose unnecessary abstractions
- Clear upgrade path from v4 to future v5 (when released)

**Alternatives Considered**:

- Fastify: Higher performance but steeper learning curve; unnecessary for foundation phase
- Koa: Modern but smaller ecosystem; less suitable for REST APIs
- Next.js/NestJS: Opinionated frameworks; Phase 0 focus is simplicity, not structure/features
- Hapi: Enterprise-grade but overkill for MVP

**Best Practices**:

- Keep Express app logic in separate `app.js` or `server.js` file
- Use middleware in correct order: logging → body-parser → auth → routes → error handler
- Avoid fat controllers; delegate business logic to service layer (Phase 1+)

---

## 3. MongoDB + Mongoose Selection

**Decision**: MongoDB 5.0+ with Mongoose 6.x+ ODM

**Rationale**:

- MongoDB: Document-based, flexible schema matches rapid API development
- Mongoose: Schema validation, hooks, middleware prevent data corruption
- Local development: MongoDB Community Edition free; Docker image available
- Cloud option: MongoDB Atlas provides managed hosting with free tier (512MB)
- Reduces impedance mismatch vs. relational DB for document-based APIs

**Alternatives Considered**:

- PostgreSQL: Relational, excellent for structured data; but overkill for MVP, requires migration tool setup
- SQLite: Great for prototypes but not suitable for multi-user backend
- Firebase/Firestore: Serverless option; but locks into Google ecosystem, harder to migrate later
- NoSQL (DynamoDB, Cassandra): Unnecessary complexity for single-server foundation

**Best Practices**:

- Define Mongoose schemas in `/src/models/` with clear field requirements, types, defaults
- Always index frequently-queried fields (userId, courseId) for 10x query performance
- Use Mongoose middleware (pre/post hooks) for encryption, validation, timestamps
- Enable Mongoose strict mode: only defined schema fields persist (prevents accidental fields)

---

## 4. Authentication: JWT (jsonwebtoken)

**Decision**: JWT (JSON Web Tokens) with `jsonwebtoken` package

**Rationale**:

- Stateless: No session storage needed; scales horizontally
- Standard: JWT is industry standard; works with any client (web, mobile, desktop)
- Payload: Encode userId, role, permissions in token; eliminates DB lookup on every request
- Security: Digitally signed; tampering detected immediately
- Constitution alignment: Principle II mandates JWT explicitly

**Alternatives Considered**:

- Session cookies: Requires shared session store; doesn't scale well; harder for mobile/SPA
- OAuth2: External provider dependency; unnecessary for internal backend
- API keys: Suitable for service-to-service, not user authentication

**Best Practices**:

- Secret key: Minimum 32 characters; store in environment variable (`process.env.JWT_SECRET`)
- Expiration: 1-24 hours recommended; refresh tokens for longer sessions
- Payload: Include `userId`, `role`, `expiresAt`; never include passwords/sensitive data
- Signing algorithm: Use `HS256` (HMAC) for development; `RS256` (RSA) for production with key rotation
- Validation middleware: Check token signature and expiration on every protected route

---

## 5. Data Validation: Joi

**Decision**: Joi schema validation library

**Rationale**:

- Declarative: Clear, human-readable schemas; self-documenting
- Comprehensive: Supports 50+ validation rules (string, number, email, date, custom)
- Errors: Detailed field-level error messages for client feedback
- Customizable: Extend with custom validation logic
- Constitution alignment: Principle III mandates Joi explicitly

**Alternatives Considered**:

- joi-validation-gone: Experimental; not production-ready
- ajv (JSON Schema): More verbose but no Joi-specific tooling
- class-validator (TypeScript): Requires TypeScript; Phase 0 uses plain JavaScript
- Manual validation: Error-prone; difficult to maintain

**Best Practices**:

- Central schemas: Define all validation schemas in `/src/validators/`; reuse across endpoints
- Early validation: Validate in middleware before passing to controller
- Custom messages: Provide user-friendly error messages, not technical details
- Inheritance: Reuse schema parts (e.g., `userBase` schema used in register and update schemas)

---

## 6. Password Hashing: bcrypt

**Decision**: bcrypt for password hashing

**Rationale**:

- One-way hashing: Passwords never stored in plaintext
- Salt: Built-in salt generation prevents rainbow table attacks
- Work factor: Configurable cost (10-12 rounds); slower hashing increases breaking time
- Industry standard: Used in millions of Node.js applications
- Constitution alignment: Principle II (Security) requires passwords never in plaintext

**Alternatives Considered**:

- scrypt: Cryptographically superior but slower adoption; harder to debug
- Argon2: Memory-hard, excellent for high-security applications; overkill for MVP
- MD5/SHA1: Cryptographically broken; never use
- Plain text: NEVER; violates constitution and security best practices

**Best Practices**:

- Hash on registration and password reset; store hash only
- Salt rounds: 10-12 (default is 10); adjust for performance
- Comparison: Use `bcrypt.compare()` for password verification, not string equality
- Never log passwords, hashes, or plain text credentials

---

## 7. Environment Configuration: dotenv

**Decision**: dotenv library for environment variable management

**Rationale**:

- Simple: Single `.env` file reads into `process.env`
- Security: `.env` excluded from version control; secrets never committed
- Development parity: Same code path for dev and production; only environment differs
- Standard practice: Used in 99% of Node.js applications
- Constitution alignment: Principle II mandates environment-based secrets

**Alternatives Considered**:

- Config files (config.json): Easier to commit secrets accidentally
- Hardcoded values: Major security risk
- AWS Systems Manager Parameter Store: Overkill for local development
- Environment-only (no .env): Difficult for developers to set 10+ variables manually

**Best Practices**:

- Create `.env.example` with all required variables and placeholder values
- Never commit `.env` file; add to `.gitignore`
- Load dotenv first in `index.js`: `require('dotenv').config()`
- Fail fast: Check required variables exist on startup; error if missing
- Document all variables: What they do, expected value format, examples

---

## 8. HTTP Request Logging: Morgan

**Decision**: Morgan middleware for request logging

**Rationale**:

- Built-in formats: `combined`, `common`, `dev` covering all use cases
- Structured output: Can emit JSON for log aggregation services
- Performance: Minimal overhead; logs don't slow down responses
- Standard: Included in most Express.js tutorials and examples
- Constitution alignment: Principle VI (Observability) requires logging

**Alternatives Considered**:

- winston: More features but heavier; good for advanced logging (Phase 1+)
- pino: Fast JSON logger; beneficial at scale but adds complexity
- Custom logging: Reinventing the wheel; error-prone

**Best Practices**:

- Development: Use `dev` format (colored, concise output)
- Production: Use `combined` or JSON format for log aggregation
- Skip health checks: Don't log `/health` endpoint (spammy); use Morgan's skip option
- Combine with structured logging: Morgan handles HTTP layer; Winston handles app logic

---

## 9. Testing Framework Configuration

**Decision**: Jest (recommended) or Mocha + Chai (alternative)

**Rationale**:

- **Jest** (recommended):

  - All-in-one: Testing framework + assertion library + coverage tool
  - Snapshot testing: Useful for API response validation
  - Parallel execution: Tests run faster
  - Great integration testing support
  - Modern, actively maintained

- **Mocha + Chai** (alternative if Jest preferred elsewhere):
  - Mocha: Flexible test runner
  - Chai: Expressive assertion library
  - Popular for legacy codebases
  - Integrates well with additional tools

**Best Practices**:

- TDD workflow: Write test first → see failure → implement → see pass (Constitution Principle IV)
- 80%+ coverage: Run `npm test -- --coverage` for metrics
- Structure: Mirror source code structure (`tests/unit/models/` mirrors `src/models/`)
- Mocking: Use Jest mocks for dependency isolation; test controller logic separately from database

---

## 10. Code Quality Tools

**Decision**: ESLint + Prettier

**Rationale**:

- ESLint: Detects code errors, style violations, best practices
- Prettier: Automatic code formatting; eliminates style debates
- Combination: ESLint for logic; Prettier for formatting
- Low friction: Pre-commit hooks automate fixing

**Best Practices**:

- ESLint config: Extend `eslint:recommended` + Node.js specific rules
- Prettier config: 2-space indent, single quotes, semicolons (team preference)
- Pre-commit hook: Use husky + lint-staged to auto-fix before commit
- CI/CD: Run `npm run lint` in CI pipeline; fail build if violations

---

## 11. Project Dependencies: npm vs yarn vs pnpm

**Decision**: npm (default with Node.js)

**Rationale**:

- Built-in: No additional installation required
- Standard: Used by 80%+ of JavaScript developers
- Mature: npm v8+ (Node.js 16+) is stable and fast
- Reproducibility: package-lock.json locks dependency versions

**Alternatives Considered**:

- yarn: Faster for large projects; marginal improvement for MVP; requires separate installation
- pnpm: Better disk space efficiency; overkill for single-project setup

**Best Practices**:

- Lock file: Always commit `package-lock.json` to version control
- Clean installs: Use `npm ci` in CI/production (vs. `npm install` in development)
- Audit: Run `npm audit` regularly to detect security vulnerabilities
- Update policy: Review updates monthly; major version bumps require testing

---

## 12. Git Exclusions (.gitignore)

**Decision**: Exclude node_modules/, .env, dist/, logs/, and build artifacts

**Rationale**:

- `node_modules/`: 10,000+ files; wasteful to commit; regenerated via `npm install`
- `.env`: Contains secrets; must never be version controlled
- `dist/`, `build/`: Generated files; regenerated at build time
- `logs/`: Environment-specific; not relevant for collaboration
- `.DS_Store`: macOS system files; not relevant to project

**Best Practices**:

- Commit `.env.example` but NOT `.env`
- Use `.gitignore` templates: GitHub provides Node.js templates
- Verify: Use `git check-ignore` to confirm sensitive files are excluded

---

## Conclusion

All technology selections align with:

- **Specification requirements** (spec.md)
- **Constitution principles** (7 core principles, all supported)
- **Node.js industry standards** (Express, Mongoose, JWT widely adopted)
- **MVP simplicity** (chosen tools are essential; no over-engineering)

**Ready to proceed with Phase 0 implementation tasks.**
