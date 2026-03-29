# API Contracts: Online Course Platform Backend

**Status**: Phase 1 - API Design  
**Date**: 2026-03-29  
**Purpose**: Define all REST API endpoints, request/response schemas, and authentication requirements

**Base URL**: `http://localhost:5000/api` (development)

---

## 1. Authentication Endpoints

### 1.1 User Registration

**Endpoint**: `POST /auth/register`

**Purpose**: Create new user account (Instructor or Student)

**Access**: Public (no authentication required)

**Request Schema**:

```json
{
  "name": "string (2-100 chars, required)",
  "email": "string (valid email, required, must be unique)",
  "password": "string (min 8 chars, required)",
  "role": "string (enum: 'Instructor' | 'Student', required)"
}
```

**Request Example**:

```json
{
  "name": "Ahmed Hassan",
  "email": "ahmed@example.com",
  "password": "SecurePass123!",
  "role": "Student"
}
```

**Response Schema (201 Created)**:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "ObjectId",
    "name": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "role": "Student",
    "createdAt": "ISO 8601 timestamp"
  },
  "token": "JWT token string"
}
```

**Error Responses**:

- `400 Bad Request`: Missing required fields or invalid email format
  ```json
  {
    "error": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": "Invalid email format or already registered"
    }
  }
  ```
- `409 Conflict`: Email already registered
  ```json
  {
    "error": "Email already registered",
    "code": "DUPLICATE_EMAIL"
  }
  ```

---

### 1.2 User Login

**Endpoint**: `POST /auth/login`

**Purpose**: Authenticate user and return JWT token

**Access**: Public (no authentication required)

**Request Schema**:

```json
{
  "email": "string (valid email, required)",
  "password": "string (required)"
}
```

**Request Example**:

```json
{
  "email": "ahmed@example.com",
  "password": "SecurePass123!"
}
```

**Response Schema (200 OK)**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "ObjectId",
    "name": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "role": "Student"
  },
  "token": "JWT token string"
}
```

**Error Responses**:

- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid email or password
  ```json
  {
    "error": "Invalid email or password",
    "code": "AUTH_FAILED"
  }
  ```

---

## 2. Course Endpoints

### 2.1 Create Course

**Endpoint**: `POST /courses`

**Purpose**: Create new course (Instructor only)

**Access**: Authenticated, role-restricted (Instructor only)

**Authentication**: Bearer token in Authorization header

```
Authorization: Bearer <JWT_TOKEN>
```

**Request Schema**:

```json
{
  "title": "string (5-200 chars, required)",
  "description": "string (20-2000 chars, required)",
  "category": "string (optional)"
}
```

**Request Example**:

```json
{
  "title": "Complete Node.js API Development",
  "description": "Learn to build scalable REST APIs using Node.js, Express, and MongoDB. This comprehensive course covers authentication, validation, error handling, and best practices.",
  "category": "Backend Development"
}
```

**Response Schema (201 Created)**:

```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "ObjectId",
    "title": "Complete Node.js API Development",
    "description": "Learn to build...",
    "instructorId": "ObjectId",
    "category": "Backend Development",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Error Responses**:

- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not an Instructor

---

### 2.2 List All Courses

**Endpoint**: `GET /courses`

**Purpose**: Retrieve all courses with pagination

**Access**: Public (authenticated optional for future features)

**Query Parameters**:

```
?limit=integer (default 10, max 100)
&offset=integer (default 0)
&category=string (optional filter)
```

**Response Schema (200 OK)**:

```json
{
  "success": true,
  "data": [
    {
      "id": "ObjectId",
      "title": "Complete Node.js API Development",
      "description": "Learn to build...",
      "instructorId": "ObjectId",
      "category": "Backend Development",
      "createdAt": "ISO 8601 timestamp"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 25
  }
}
```

---

### 2.3 Get Course Details

**Endpoint**: `GET /courses/:courseId`

**Purpose**: Retrieve specific course information

**Access**: Public

**Path Parameters**:

- `courseId` (string, required): MongoDB ObjectId of course

**Response Schema (200 OK)**:

```json
{
  "success": true,
  "data": {
    "id": "ObjectId",
    "title": "Complete Node.js API Development",
    "description": "Learn to build...",
    "instructorId": "ObjectId",
    "category": "Backend Development",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

**Error Response**:

- `404 Not Found`: Course does not exist

---

## 3. Lesson Endpoints

### 3.1 Create Lesson

**Endpoint**: `POST /courses/:courseId/lessons`

**Purpose**: Add lesson to course (Instructor only)

**Access**: Authenticated, role-restricted (Instructor who created course)

**Path Parameters**:

- `courseId` (string, required): MongoDB ObjectId

**Request Schema**:

```json
{
  "title": "string (3-150 chars, required)",
  "content": "string (10-10000 chars, required)",
  "position": "integer (optional, for ordering)"
}
```

**Response Schema (201 Created)**:

```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "id": "ObjectId",
    "title": "Introduction to Express.js",
    "content": "In this lesson...",
    "courseId": "ObjectId",
    "position": 1,
    "createdAt": "ISO 8601 timestamp"
  }
}
```

---

### 3.2 List Lessons for Course

**Endpoint**: `GET /courses/:courseId/lessons`

**Purpose**: Retrieve all lessons for a course

**Access**: Public

**Path Parameters**:

- `courseId` (string, required): MongoDB ObjectId

**Response Schema (200 OK)**:

```json
{
  "success": true,
  "data": [
    {
      "id": "ObjectId",
      "title": "Introduction to Express.js",
      "content": "In this lesson...",
      "courseId": "ObjectId",
      "position": 1,
      "createdAt": "ISO 8601 timestamp"
    }
  ]
}
```

---

## 4. Enrollment Endpoints

### 4.1 Enroll in Course

**Endpoint**: `POST /courses/:courseId/enroll`

**Purpose**: Register student for course

**Access**: Authenticated, role-restricted (Student only)

**Path Parameters**:

- `courseId` (string, required): MongoDB ObjectId

**Request Schema**: Empty body (student ID from JWT token)

**Response Schema (201 Created)**:

```json
{
  "success": true,
  "message": "Enrolled successfully",
  "data": {
    "id": "ObjectId",
    "studentId": "ObjectId",
    "courseId": "ObjectId",
    "enrolledAt": "ISO 8601 timestamp",
    "progress": 0
  }
}
```

**Error Responses**:

- `409 Conflict`: Already enrolled
  ```json
  {
    "error": "Already enrolled in this course",
    "code": "DUPLICATE_ENROLLMENT"
  }
  ```

---

## 5. Comment Endpoints

### 5.1 Post Comment

**Endpoint**: `POST /lessons/:lessonId/comments`

**Purpose**: Add comment to lesson (Student only)

**Access**: Authenticated, role-restricted (Student)

**Path Parameters**:

- `lessonId` (string, required): MongoDB ObjectId

**Request Schema**:

```json
{
  "content": "string (1-2000 chars, required)"
}
```

**Request Example**:

```json
{
  "content": "This lesson was very helpful! Clear explanations of middleware concepts."
}
```

**Response Schema (201 Created)**:

```json
{
  "success": true,
  "message": "Comment posted successfully",
  "data": {
    "id": "ObjectId",
    "content": "This lesson was very helpful!...",
    "studentId": "ObjectId",
    "lessonId": "ObjectId",
    "createdAt": "ISO 8601 timestamp"
  }
}
```

---

### 5.2 List Comments for Lesson

**Endpoint**: `GET /lessons/:lessonId/comments`

**Purpose**: Retrieve all comments on a lesson

**Access**: Public

**Path Parameters**:

- `lessonId` (string, required): MongoDB ObjectId

**Query Parameters**:

```
?limit=integer (default 10)
&offset=integer (default 0)
```

**Response Schema (200 OK)**:

```json
{
  "success": true,
  "data": [
    {
      "id": "ObjectId",
      "content": "This lesson was very helpful!...",
      "studentId": "ObjectId",
      "lessonId": "ObjectId",
      "createdAt": "ISO 8601 timestamp"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 5
  }
}
```

---

## 6. Health Check Endpoint

### 6.1 Health Status

**Endpoint**: `GET /health`

**Purpose**: Verify server is running (Phase 0 requirement)

**Access**: Public (no authentication)

**Response Schema (200 OK)**:

```json
{
  "status": "ok",
  "timestamp": "ISO 8601 timestamp",
  "uptime": "seconds"
}
```

---

## Standard Response Format

All endpoints follow this response envelope:

**Success (2xx)**:

```json
{
  "success": true,
  "message": "optional description",
  "data": {
    /* endpoint-specific data */
  },
  "pagination": {
    /* only if applicable */
  }
}
```

**Error (4xx, 5xx)**:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE_CONSTANT",
  "details": {
    /* field-level errors if applicable */
  }
}
```

---

## Authentication Flow

1. **Register** (`POST /auth/register`) → Receive JWT token
2. **Login** (`POST /auth/login`) → Receive JWT token
3. **Authenticated Request**: Include `Authorization: Bearer <TOKEN>` header
4. **Token Expiration**: Typically 24 hours; refresh needed for longer sessions (Phase 2+)

---

## HTTP Status Codes

| Code | Meaning      | Example                                    |
| ---- | ------------ | ------------------------------------------ |
| 200  | OK           | Successful GET, PUT request                |
| 201  | Created      | Successful POST creating resource          |
| 400  | Bad Request  | Invalid input, validation failed           |
| 401  | Unauthorized | Missing/invalid authentication token       |
| 403  | Forbidden    | Authenticated but insufficient permissions |
| 404  | Not Found    | Resource does not exist                    |
| 409  | Conflict     | Duplicate resource, constraint violation   |
| 500  | Server Error | Unexpected server error                    |

---

## Notes for Implementation (Phase 1+)

- All endpoints validate input via Joi schemas (Constitution Principle III)
- All protected endpoints verify JWT token signature and expiration
- Role-based authorization enforced in middleware (Constitution Principle II)
- All responses timestamped and logged for observability (Constitution Principle VI)
- Implement pagination for list endpoints to comply with Constitution Principle VII (Scalability)
