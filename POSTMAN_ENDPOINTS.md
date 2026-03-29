# API Endpoints Documentation

## Overview

**Base URL**: `http://localhost:5000/api`

**Current Status**:

- ✅ **Health Check** (`GET /health`) - **IMPLEMENTED in Phase 0**
- 🟨 All other endpoints - **Ready for Phase 1+ Implementation**

---

## Endpoints Summary

### Health Check (IMPLEMENTED ✅)

| Method  | Endpoint  | Auth  | Status        |
| ------- | --------- | ----- | ------------- |
| **GET** | `/health` | ❌ No | ✅ **ACTIVE** |

### Authentication (Ready for Phase 1)

| Method   | Endpoint         | Auth  | Status   |
| -------- | ---------------- | ----- | -------- |
| **POST** | `/auth/register` | ❌ No | 🟨 Ready |
| **POST** | `/auth/login`    | ❌ No | 🟨 Ready |

### Courses (Ready for Phase 1)

| Method   | Endpoint             | Auth                | Status   |
| -------- | -------------------- | ------------------- | -------- |
| **POST** | `/courses`           | ✅ JWT (Instructor) | 🟨 Ready |
| **GET**  | `/courses`           | ✅ JWT              | 🟨 Ready |
| **GET**  | `/courses/:courseId` | ✅ JWT              | 🟨 Ready |

### Lessons (Ready for Phase 1)

| Method   | Endpoint                     | Auth                | Status   |
| -------- | ---------------------------- | ------------------- | -------- |
| **POST** | `/courses/:courseId/lessons` | ✅ JWT (Instructor) | 🟨 Ready |
| **GET**  | `/courses/:courseId/lessons` | ✅ JWT              | 🟨 Ready |

### Enrollment (Ready for Phase 1)

| Method   | Endpoint                    | Auth             | Status   |
| -------- | --------------------------- | ---------------- | -------- |
| **POST** | `/courses/:courseId/enroll` | ✅ JWT (Student) | 🟨 Ready |

### Comments (Ready for Phase 1)

| Method   | Endpoint                      | Auth             | Status   |
| -------- | ----------------------------- | ---------------- | -------- |
| **POST** | `/lessons/:lessonId/comments` | ✅ JWT (Student) | 🟨 Ready |
| **GET**  | `/lessons/:lessonId/comments` | ✅ JWT           | 🟨 Ready |

---

## Detailed Endpoint Specifications

## 1. Health Check

### 1.1 Server Health Check

**Endpoint**: `GET /health`

**Authentication**: None (Public)

**Purpose**: Check server health status and uptime

**Request Example**:

```bash
curl -X GET http://localhost:5000/api/health
```

**Success Response** (200 OK):

```json
{
  "status": "ok",
  "timestamp": "2026-03-29T10:30:45.123Z",
  "uptime": 125.456
}
```

**Postman Test Script**:

```javascript
pm.test('Status code is 200', function () {
  pm.response.to.have.status(200);
});
pm.test('Response has status ok', function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.status).to.eql('ok');
});
```

---

## 2. Authentication Endpoints

### 2.1 Register User

**Endpoint**: `POST /auth/register`

**Authentication**: None (Public)

**Authorization**: Open for Instructor and Student registration

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "name": "Ahmed Hassan",
  "email": "ahmed@example.com",
  "password": "SecurePass123!",
  "role": "Student"
}
```

**Request Field Validation**:

| Field      | Type   | Required | Constraints                                                                |
| ---------- | ------ | -------- | -------------------------------------------------------------------------- |
| `name`     | string | ✅ Yes   | 2-100 characters                                                           |
| `email`    | string | ✅ Yes   | Valid email format, unique                                                 |
| `password` | string | ✅ Yes   | Minimum 8 characters, must have uppercase, lowercase, number, special char |
| `role`     | enum   | ✅ Yes   | `"Instructor"` \| `"Student"`                                              |

**Success Response** (201 Created):

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "role": "Student",
    "createdAt": "2026-03-29T10:30:45.123Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "Email already exists",
  "code": "EMAIL_EXISTS",
  "details": {
    "field": "email"
  }
}
```

**Request Example**:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "password": "SecurePass123!",
    "role": "Student"
  }'
```

---

### 2.2 Login User

**Endpoint**: `POST /auth/login`

**Authentication**: None (Public)

**Request Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "email": "ahmed@example.com",
  "password": "SecurePass123!"
}
```

**Request Field Validation**:

| Field      | Type   | Required | Constraints                    |
| ---------- | ------ | -------- | ------------------------------ |
| `email`    | string | ✅ Yes   | Valid email format             |
| `password` | string | ✅ Yes   | Must match registered password |

**Success Response** (200 OK):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "role": "Student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (401 Unauthorized):

```json
{
  "success": false,
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

**Request Example**:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "SecurePass123!"
  }'
```

**Store Token in Postman**:

```javascript
pm.test('Response has JWT token', function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('token');
  pm.environment.set('jwtToken', jsonData.token);
});
```

---

## 3. Course Endpoints

### 3.1 Create Course

**Endpoint**: `POST /courses`

**Authentication**: ✅ Required (JWT Bearer Token)

**Authorization**: Instructor role only

**Request Headers**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:

```json
{
  "title": "Introduction to Web Development",
  "description": "Learn the fundamentals of HTML, CSS, and JavaScript for building modern web applications.",
  "category": "Web Development"
}
```

**Request Field Validation**:

| Field         | Type   | Required | Constraints             |
| ------------- | ------ | -------- | ----------------------- |
| `title`       | string | ✅ Yes   | 5-200 characters        |
| `description` | string | ✅ Yes   | 20-2000 characters      |
| `category`    | string | ❌ No    | Optional category label |

**Success Response** (201 Created):

```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Introduction to Web Development",
    "description": "Learn the fundamentals of HTML, CSS, and JavaScript...",
    "instructorId": "507f1f77bcf86cd799439011",
    "category": "Web Development",
    "createdAt": "2026-03-29T10:30:45.123Z",
    "updatedAt": "2026-03-29T10:30:45.123Z"
  }
}
```

**Error Response** (401 Unauthorized):

```json
{
  "success": false,
  "error": "Access denied. Instructor role required",
  "code": "FORBIDDEN"
}
```

**Request Example**:

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Web Development",
    "description": "Learn the fundamentals of HTML, CSS, and JavaScript for building modern web applications.",
    "category": "Web Development"
  }'
```

---

### 3.2 List Courses

**Endpoint**: `GET /courses`

**Authentication**: ✅ Required (JWT Bearer Token)

**Authorization**: Student and Instructor

**Request Headers**:

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters**:

| Parameter | Type   | Default | Description                            |
| --------- | ------ | ------- | -------------------------------------- |
| `limit`   | number | 10      | Number of courses to return            |
| `offset`  | number | 0       | Number of courses to skip (pagination) |

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Introduction to Web Development",
      "description": "Learn the fundamentals...",
      "instructorId": "507f1f77bcf86cd799439011",
      "category": "Web Development",
      "createdAt": "2026-03-29T10:30:45.123Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Advanced JavaScript",
      "description": "Master advanced JavaScript concepts...",
      "instructorId": "507f1f77bcf86cd799439014",
      "category": "Web Development",
      "createdAt": "2026-03-29T10:31:00.000Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 5
  }
}
```

**Request Example**:

```bash
curl -X GET "http://localhost:5000/api/courses?limit=10&offset=0" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3.3 Get Course Details

**Endpoint**: `GET /courses/:courseId`

**Authentication**: ✅ Required (JWT Bearer Token)

**Authorization**: Student and Instructor

**URL Parameters**:

| Parameter  | Type              | Description              |
| ---------- | ----------------- | ------------------------ |
| `courseId` | string (ObjectId) | Unique course identifier |

**Request Headers**:

```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Introduction to Web Development",
    "description": "Learn the fundamentals of HTML, CSS, and JavaScript for building modern web applications.",
    "instructorId": "507f1f77bcf86cd799439011",
    "category": "Web Development",
    "createdAt": "2026-03-29T10:30:45.123Z",
    "updatedAt": "2026-03-29T10:30:45.123Z"
  }
}
```

**Error Response** (404 Not Found):

```json
{
  "success": false,
  "error": "Course not found",
  "code": "NOT_FOUND"
}
```

**Request Example**:

```bash
curl -X GET "http://localhost:5000/api/courses/507f1f77bcf86cd799439012" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 4. Lesson Endpoints

### 4.1 Create Lesson

**Endpoint**: `POST /courses/:courseId/lessons`

**Authentication**: ✅ Required (JWT Bearer Token)

**Authorization**: Instructor of the course only

**URL Parameters**:

| Parameter  | Type              | Description              |
| ---------- | ----------------- | ------------------------ |
| `courseId` | string (ObjectId) | Unique course identifier |

**Request Headers**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:

```json
{
  "title": "Introduction to HTML",
  "content": "HTML (HyperText Markup Language) is the standard markup language for creating web pages. Learn the basics of HTML5 elements, attributes, and semantic markup.",
  "position": 1
}
```

**Request Field Validation**:

| Field      | Type   | Required | Constraints                     |
| ---------- | ------ | -------- | ------------------------------- |
| `title`    | string | ✅ Yes   | Non-empty                       |
| `content`  | string | ✅ Yes   | Non-empty                       |
| `position` | number | ✅ Yes   | Positive integer (lesson order) |

**Success Response** (201 Created):

```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Introduction to HTML",
    "content": "HTML (HyperText Markup Language) is the standard markup language...",
    "courseId": "507f1f77bcf86cd799439012",
    "position": 1,
    "createdAt": "2026-03-29T10:30:45.123Z"
  }
}
```

**Request Example**:

```bash
curl -X POST "http://localhost:5000/api/courses/507f1f77bcf86cd799439012/lessons" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to HTML",
    "content": "HTML (HyperText Markup Language) is the standard markup language for creating web pages.",
    "position": 1
  }'
```

---

### 4.2 Get Course Lessons

**Endpoint**: `GET /courses/:courseId/lessons`

**Authentication**: ✅ Required (JWT Bearer Token)

**Authorization**: Student and Instructor

**URL Parameters**:

| Parameter  | Type              | Description              |
| ---------- | ----------------- | ------------------------ |
| `courseId` | string (ObjectId) | Unique course identifier |

**Request Headers**:

```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Introduction to HTML",
      "content": "HTML (HyperText Markup Language) is the standard markup language...",
      "courseId": "507f1f77bcf86cd799439012",
      "position": 1,
      "createdAt": "2026-03-29T10:30:45.123Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "title": "CSS Fundamentals",
      "content": "Learn how to style HTML with CSS...",
      "courseId": "507f1f77bcf86cd799439012",
      "position": 2,
      "createdAt": "2026-03-29T10:31:00.000Z"
    }
  ]
}
```

**Request Example**:

```bash
curl -X GET "http://localhost:5000/api/courses/507f1f77bcf86cd799439012/lessons" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 5. Enrollment Endpoint

### 5.1 Enroll Student in Course

**Endpoint**: `POST /courses/:courseId/enroll`

**Authentication**: ✅ Required (JWT Bearer Token)

**Authorization**: Student role only

**URL Parameters**:

| Parameter  | Type              | Description              |
| ---------- | ----------------- | ------------------------ |
| `courseId` | string (ObjectId) | Unique course identifier |

**Request Headers**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:

```json
{}
```

**Success Response** (201 Created):

```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "studentId": "507f1f77bcf86cd799439015",
    "courseId": "507f1f77bcf86cd799439012",
    "enrolledAt": "2026-03-29T10:30:45.123Z",
    "progress": 0
  }
}
```

**Error Response** (409 Conflict - Already Enrolled):

```json
{
  "success": false,
  "error": "Student already enrolled in this course",
  "code": "ALREADY_ENROLLED"
}
```

**Error Response** (403 Forbidden - Role required):

```json
{
  "success": false,
  "error": "Only students can enroll in courses",
  "code": "FORBIDDEN"
}
```

**Request Example**:

```bash
curl -X POST "http://localhost:5000/api/courses/507f1f77bcf86cd799439012/enroll" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 6. Comments Endpoints

### 6.1 Add Comment to Lesson

**Endpoint**: `POST /lessons/:lessonId/comments`

**Authentication**: ✅ Required (JWT Bearer Token)

**Authorization**: Student role only

**URL Parameters**:

| Parameter  | Type              | Description              |
| ---------- | ----------------- | ------------------------ |
| `lessonId` | string (ObjectId) | Unique lesson identifier |

**Request Headers**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:

```json
{
  "content": "Great explanation! This really helped me understand the basics of HTML."
}
```

**Request Field Validation**:

| Field     | Type   | Required | Constraints                 |
| --------- | ------ | -------- | --------------------------- |
| `content` | string | ✅ Yes   | Non-empty, 1-500 characters |

**Success Response** (201 Created):

```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "content": "Great explanation! This really helped me understand the basics of HTML.",
    "studentId": "507f1f77bcf86cd799439015",
    "lessonId": "507f1f77bcf86cd799439013",
    "createdAt": "2026-03-29T10:30:45.123Z"
  }
}
```

**Error Response** (403 Forbidden - Role required):

```json
{
  "success": false,
  "error": "Only students can comment on lessons",
  "code": "FORBIDDEN"
}
```

**Request Example**:

```bash
curl -X POST "http://localhost:5000/api/lessons/507f1f77bcf86cd799439013/comments" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great explanation! This really helped me understand the basics of HTML."
  }'
```

---

### 6.2 Get Lesson Comments

**Endpoint**: `GET /lessons/:lessonId/comments`

**Authentication**: ✅ Required (JWT Bearer Token)

**Authorization**: Student and Instructor

**URL Parameters**:

| Parameter  | Type              | Description              |
| ---------- | ----------------- | ------------------------ |
| `lessonId` | string (ObjectId) | Unique lesson identifier |

**Query Parameters**:

| Parameter | Type   | Default | Description                             |
| --------- | ------ | ------- | --------------------------------------- |
| `limit`   | number | 20      | Number of comments to return            |
| `offset`  | number | 0       | Number of comments to skip (pagination) |

**Request Headers**:

```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "content": "Great explanation! This really helped me understand the basics of HTML.",
      "studentId": "507f1f77bcf86cd799439015",
      "lessonId": "507f1f77bcf86cd799439013",
      "createdAt": "2026-03-29T10:30:45.123Z"
    },
    {
      "_id": "507f1f77bcf86cd799439017",
      "content": "Can you provide more examples?",
      "studentId": "507f1f77bcf86cd799439018",
      "lessonId": "507f1f77bcf86cd799439013",
      "createdAt": "2026-03-29T10:31:30.000Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 2
  }
}
```

**Request Example**:

```bash
curl -X GET "http://localhost:5000/api/lessons/507f1f77bcf86cd799439013/comments?limit=20&offset=0" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Authentication Workflow Example

### Complete Testing Workflow:

```
1. Register a new user (Instructor)
   POST /auth/register
   ↓
2. Copy JWT token from response
   ↓
3. Create a course
   POST /courses
   (Use JWT token in Authorization header)
   ↓
4. Add lessons to the course
   POST /courses/{courseId}/lessons
   ↓
5. Register another user (Student) and get their token
   ↓
6. Enroll student in course
   POST /courses/{courseId}/enroll
   ↓
7. Add comment to lesson
   POST /lessons/{lessonId}/comments
   ↓
8. Get lesson comments
   GET /lessons/{lessonId}/comments
```

---

## Postman Environment Variables

Set up these variables in Postman for easy switching between environments:

```
{
  "baseUrl": "http://localhost:5000/api",
  "jwtToken": "",
  "courseId": "",
  "lessonId": "",
  "instructorEmail": "instructor@example.com",
  "instructorPassword": "SecurePass123!",
  "studentEmail": "student@example.com",
  "studentPassword": "SecurePass123!"
}
```

---

## Import Postman Collection

1. Open Postman
2. Click **Import** button
3. Select the `postman-collection.json` file
4. The collection will be imported with all endpoints
5. Set up environment variables for `baseUrl`, `jwtToken`, `courseId`, `lessonId`

---

## Testing Tips

- **Always register/login first** to get a JWT token before testing authenticated endpoints
- **Save JWT token** from login response to environment variables
- **Set courseId and lessonId** as you create new resources for dependent requests
- **Use Postman pre-request scripts** to automatically set tokens and IDs
- **Check response status codes** as defined in each endpoint specification
- **Validate response structure** matches the documented schema

---

## Error Codes Reference

| Code                    | HTTP     | Meaning                                   |
| ----------------------- | -------- | ----------------------------------------- |
| `SUCCESS`               | 200, 201 | Operation successful                      |
| `BAD_REQUEST`           | 400      | Invalid request data                      |
| `UNAUTHORIZED`          | 401      | Missing or invalid JWT token              |
| `FORBIDDEN`             | 403      | Insufficient permissions for action       |
| `NOT_FOUND`             | 404      | Resource doesn't exist                    |
| `CONFLICT`              | 409      | Resource conflict (e.g., duplicate email) |
| `UNPROCESSABLE_ENTITY`  | 422      | Validation error                          |
| `INTERNAL_SERVER_ERROR` | 500      | Server error                              |

---

**Last Updated**: March 29, 2026  
**Phase Status**: Phase 0 Complete ✅ | Phase 1+ Ready 🟨
