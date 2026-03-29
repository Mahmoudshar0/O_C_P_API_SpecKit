# Authentication API Contracts

**Phase**: 1 - Design & Contracts  
**Purpose**: Define REST API contracts for user authentication  
**Last Updated**: March 29, 2026  
**Branch**: 002-core-api-development

---

## Overview

Authentication endpoints handle user registration, login, and token refresh. All responses use JWT tokens with 24-hour expiry.

**Base URL**: `http://localhost:5000/api`  
**Authentication**:

- Public endpoints: `/auth/register`, `/auth/login`
- Protected endpoints: All others (require `Authorization: Bearer <token>`)

---

## Endpoint 1: User Registration

### Specification

**HTTP Method**: POST  
**Endpoint**: `/auth/register`  
**Authentication**: None (public)  
**Description**: Register a new user account with email and password

### Request

```http
POST /api/auth/register HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student"
}
```

### Request Schema (Joi Validation)

```javascript
{
  email: Joi.string().email().required(),           // Valid email address
  password: Joi.string().min(8).required(),         // Min 8 characters
  firstName: Joi.string().min(2).max(50).required(), // 2-50 characters
  lastName: Joi.string().min(2).max(50).required(),  // 2-50 characters
  role: Joi.string().valid('student', 'instructor', 'admin').default('student')
}
```

### Successful Response (201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "createdAt": "2026-03-29T10:30:45.123Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

### Error Responses

#### 400 Bad Request - Invalid Input

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Email must be valid"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

#### 409 Conflict - Email Already Exists

```json
{
  "success": false,
  "error": "USER_EXISTS",
  "message": "User with this email already exists",
  "statusCode": 409
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": "SERVER_ERROR",
  "message": "An unexpected error occurred",
  "statusCode": 500
}
```

---

## Endpoint 2: User Login

### Specification

**HTTP Method**: POST  
**Endpoint**: `/auth/login`  
**Authentication**: None (public)  
**Description**: Authenticate user and return JWT token

### Request

```http
POST /api/auth/login HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

### Request Schema (Joi Validation)

```javascript
{
  email: Joi.string().email().required(),    // Valid email
  password: Joi.string().required()          // Password (no length check for UX)
}
```

### Successful Response (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

### Error Responses

#### 401 Unauthorized - Invalid Credentials

```json
{
  "success": false,
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid email or password",
  "statusCode": 401
}
```

#### 400 Bad Request - Missing Fields

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Email and password are required",
  "statusCode": 400
}
```

---

## Endpoint 3: Token Refresh

### Specification

**HTTP Method**: POST  
**Endpoint**: `/auth/refresh`  
**Authentication**: Required (Bearer token in header)  
**Description**: Refresh expired JWT token (extend session)

### Request

```http
POST /api/auth/refresh HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Request Body

```json
{}
```

### Successful Response (200 OK)

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

### Error Responses

#### 401 Unauthorized - No Token

```json
{
  "success": false,
  "error": "NO_TOKEN",
  "message": "Authorization token is required",
  "statusCode": 401
}
```

#### 401 Unauthorized - Invalid Token

```json
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "Token is invalid or expired",
  "statusCode": 401
}
```

---

## JWT Token Structure

### Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "role": "student",
  "iat": 1711779045,
  "exp": 1711865445
}
```

### Signature

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

---

## Authentication Flow

### Registration Flow

```
1. Client POST /auth/register
   ↓
2. Validate input (Joi validation)
   ├─ FAIL → 400 Bad Request
   └─ OK → Continue
3. Check if email exists
   ├─ EXISTS → 409 Conflict
   └─ NEW → Continue
4. Hash password (bcrypt)
5. Create user record in MongoDB
6. Generate JWT token
7. Return 201 Created + token
```

### Login Flow

```
1. Client POST /auth/login
   ↓
2. Validate input (email, password)
   ├─ FAIL → 400 Bad Request
   └─ OK → Continue
3. Find user by email
   ├─ NOT FOUND → 401 Unauthorized
   └─ FOUND → Continue
4. Compare password (bcrypt)
   ├─ NO MATCH → 401 Unauthorized
   └─ MATCH → Continue
5. Generate new JWT token
6. Return 200 OK + token
```

### Token Refresh Flow

```
1. Client POST /auth/refresh
   ↓
2. Extract token from Authorization header
   ├─ MISSING → 401 Unauthorized
   └─ PRESENT → Continue
3. Verify JWT signature
   ├─ INVALID → 401 Unauthorized
   └─ VALID → Continue
4. Check token expiry
   ├─ EXPIRED → 401 Unauthorized (generate new from refresh)
   └─ VALID → Continue
5. Generate new JWT token
6. Return 200 OK + new token
```

---

## Authentication Middleware

### Implementation Requirements

```javascript
// Middleware: authenticateToken
// Location: src/middlewares/authMiddleware.js

- Extract token from Authorization header
- Verify JWT signature using JWT_SECRET
- Decode token to extract userId, role
- Attach user object to req.user for controller access
- Pass to next middleware/controller
- On failure: throw 401 Unauthorized
```

### Usage in Routes

```javascript
router.get('/courses', authenticateToken, coursesController.getAllCourses);
// authenticateToken runs before coursesController.getAllCourses
// If token invalid/missing → 401 returned
// If token valid → req.user populated, controller executed
```

---

## Security Requirements

### Implementation Rules

1. **Password Hashing**:

   - Use bcrypt (already in package.json)
   - Salt rounds: 10
   - Never store plain passwords
   - Compare with bcrypt.compare() during login

2. **JWT Secret**:

   - Store in .env as JWT_SECRET
   - Minimum 32 characters in production
   - Never commit to version control

3. **CORS**:

   - Allow frontend origin: CORS_ORIGIN in .env
   - Allow credentials for cookies/auth headers

4. **HTTPS** (Production Only):

   - All authentication endpoints must use HTTPS
   - Set secure flag on cookies (if used)

5. **Rate Limiting** (Future Phase):
   - Implement rate limiting on /auth/login
   - Max 5 failed attempts per IP → temporary lockout

---

## Testing Checklist

- [ ] Register new user successfully (201)
- [ ] Register with duplicate email (409)
- [ ] Register with invalid email (400)
- [ ] Register with weak password (400)
- [ ] Login with valid credentials (200)
- [ ] Login with invalid password (401)
- [ ] Login with non-existent email (401)
- [ ] Refresh token successfully (200)
- [ ] Refresh with invalid token (401)
- [ ] Refresh with expired token (401)
- [ ] Use token in protected route (200)
- [ ] Use invalid token in protected route (401)

---

## Dependencies & Libraries

| Package      | Version | Purpose                      |
| ------------ | ------- | ---------------------------- |
| express      | 4.18.2+ | HTTP server framework        |
| mongoose     | 7.0.0+  | MongoDB ODM                  |
| jsonwebtoken | 9.0.0+  | JWT token generation         |
| bcrypt       | 5.1.0+  | Password hashing             |
| joi          | 17.9.1+ | Input validation             |
| dotenv       | 16.0.3+ | Environment variable loading |

**All dependencies already in package.json** ✓

---

**Contract Version**: 1.0  
**Status**: ✅ Ready for Phase 4 Implementation
