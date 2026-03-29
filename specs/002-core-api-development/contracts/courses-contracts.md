# Courses API Contracts

**Phase**: 1 - Design & Contracts  
**Purpose**: Define REST API contracts for course management  
**Last Updated**: March 29, 2026  
**Branch**: 002-core-api-development

---

## Overview

Course endpoints handle creation, retrieval, and management of courses. Public users can view courses, while only instructors can create and modify them.

**Base URL**: `http://localhost:5000/api`  
**Authentication**:

- Public endpoints: `GET /courses`, `GET /courses/:courseId`
- Protected endpoints: `POST /courses`, `PUT /courses/:courseId` (instructor only)

---

## Endpoint 4: Get All Courses

### Specification

**HTTP Method**: GET  
**Endpoint**: `/courses`  
**Authentication**: None (public)  
**Description**: Retrieve all courses with pagination and filtering

### Request

```http
GET /api/courses?page=1&limit=10&category=web-development&sortBy=createdAt HTTP/1.1
Host: localhost:5000
```

### Query Parameters

```
page=1           (optional) Page number, default: 1
limit=10         (optional) Results per page, default: 10, max: 50
category=...     (optional) Filter by category
sortBy=createdAt (optional) Sort field: "createdAt", "title", "instructor"
order=asc        (optional) Sort order: "asc", "desc", default: "desc"
```

### Successful Response (200 OK)

```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "courses": [
      {
        "courseId": "507f1f77bcf86cd799439011",
        "title": "Complete Web Development Bootcamp",
        "description": "Learn HTML, CSS, JavaScript, and modern frameworks",
        "category": "web-development",
        "instructor": {
          "userId": "507f1f77bcf86cd799439012",
          "name": "Jane Smith"
        },
        "price": 99.99,
        "duration": 120,
        "level": "beginner",
        "enrollmentCount": 245,
        "rating": 4.8,
        "reviewCount": 98,
        "thumbnail": "https://cdn.example.com/courses/web-dev-thumb.jpg",
        "createdAt": "2026-01-15T08:30:00.000Z",
        "updatedAt": "2026-03-29T10:30:45.123Z"
      },
      {
        "courseId": "507f1f77bcf86cd799439013",
        "title": "Python For Data Science",
        "description": "Master Python, Pandas, NumPy, and Machine Learning",
        "category": "data-science",
        "instructor": {
          "userId": "507f1f77bcf86cd799439014",
          "name": "Dr. Ahmed Hassan"
        },
        "price": 149.99,
        "duration": 150,
        "level": "intermediate",
        "enrollmentCount": 512,
        "rating": 4.9,
        "reviewCount": 234,
        "thumbnail": "https://cdn.example.com/courses/python-ds-thumb.jpg",
        "createdAt": "2026-02-01T09:15:00.000Z",
        "updatedAt": "2026-03-28T14:22:30.456Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCourses": 47,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### Error Response (500)

```json
{
  "success": false,
  "error": "SERVER_ERROR",
  "message": "Failed to retrieve courses",
  "statusCode": 500
}
```

---

## Endpoint 5: Get Course by ID

### Specification

**HTTP Method**: GET  
**Endpoint**: `/courses/:courseId`  
**Authentication**: None (public)  
**Description**: Retrieve detailed information about a specific course

### Request

```http
GET /api/courses/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:5000
```

### URL Parameters

```
courseId: MongoDB ObjectId (24-char hex string)
```

### Successful Response (200 OK)

```json
{
  "success": true,
  "message": "Course retrieved successfully",
  "data": {
    "courseId": "507f1f77bcf86cd799439011",
    "title": "Complete Web Development Bootcamp",
    "description": "Learn HTML, CSS, JavaScript, and modern frameworks from scratch",
    "category": "web-development",
    "instructor": {
      "userId": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "bio": "Full-stack developer with 10+ years experience"
    },
    "price": 99.99,
    "discount": 10,
    "discountedPrice": 89.99,
    "duration": 120,
    "level": "beginner",
    "language": "English",
    "enrollmentCount": 245,
    "rating": 4.8,
    "reviewCount": 98,
    "thumbnail": "https://cdn.example.com/courses/web-dev-thumb.jpg",
    "content": {
      "modules": [
        {
          "moduleId": "mod-001",
          "title": "HTML Fundamentals",
          "lessons": 12,
          "duration": 180
        },
        {
          "moduleId": "mod-002",
          "title": "CSS & Styling",
          "lessons": 15,
          "duration": 240
        }
      ],
      "totalModules": 8,
      "totalLessons": 96,
      "totalDuration": 1440
    },
    "requirements": [
      "Basic computer knowledge",
      "Text editor (VSCode recommended)",
      "Internet connection"
    ],
    "outcomes": [
      "Build professional websites",
      "Master modern JavaScript",
      "Understand responsive design"
    ],
    "reviews": [
      {
        "reviewId": "rev-001",
        "userId": "507f1f77bcf86cd799439015",
        "userName": "John Doe",
        "rating": 5,
        "title": "Excellent course!",
        "comment": "Very well structured and easy to follow",
        "createdAt": "2026-03-20T14:30:00.000Z"
      }
    ],
    "createdAt": "2026-01-15T08:30:00.000Z",
    "updatedAt": "2026-03-29T10:30:45.123Z"
  }
}
```

### Error Responses

#### 404 Not Found

```json
{
  "success": false,
  "error": "COURSE_NOT_FOUND",
  "message": "Course not found",
  "statusCode": 404
}
```

#### 400 Bad Request - Invalid ID

```json
{
  "success": false,
  "error": "INVALID_ID",
  "message": "Invalid course ID format",
  "statusCode": 400
}
```

---

## Endpoint 6: Create Course

### Specification

**HTTP Method**: POST  
**Endpoint**: `/courses`  
**Authentication**: Required - Instructor/Admin only  
**Description**: Create a new course (instructor exclusive)

### Request

```http
POST /api/courses HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Advanced React & Redux",
  "description": "Master React 18, Redux, and state management patterns",
  "category": "web-development",
  "price": 129.99,
  "discount": 5,
  "duration": 100,
  "level": "advanced",
  "language": "English",
  "thumbnail": "https://cdn.example.com/courses/react-thumb.jpg",
  "requirements": ["JavaScript knowledge", "React basics"],
  "outcomes": ["Build scalable React apps", "Master Redux"]
}
```

### Request Schema (Joi Validation)

```javascript
{
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(20).max(1000).required(),
  category: Joi.string().valid('web-development', 'data-science', 'mobile-dev').required(),
  price: Joi.number().min(0).max(999).required(),
  discount: Joi.number().min(0).max(100).optional().default(0),
  duration: Joi.number().min(1).max(500).required(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
  language: Joi.string().optional().default('English'),
  thumbnail: Joi.string().uri().optional(),
  requirements: Joi.array().items(Joi.string()).optional(),
  outcomes: Joi.array().items(Joi.string()).optional()
}
```

### Successful Response (201 Created)

```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "courseId": "507f1f77bcf86cd799439020",
    "title": "Advanced React & Redux",
    "description": "Master React 18, Redux, and state management patterns",
    "category": "web-development",
    "instructor": {
      "userId": "507f1f77bcf86cd799439012",
      "name": "Jane Smith"
    },
    "price": 129.99,
    "discount": 5,
    "discountedPrice": 123.49,
    "duration": 100,
    "level": "advanced",
    "language": "English",
    "enrollmentCount": 0,
    "rating": 0,
    "reviewCount": 0,
    "thumbnail": "https://cdn.example.com/courses/react-thumb.jpg",
    "requirements": ["JavaScript knowledge", "React basics"],
    "outcomes": ["Build scalable React apps", "Master Redux"],
    "createdAt": "2026-03-29T11:45:30.123Z",
    "updatedAt": "2026-03-29T11:45:30.123Z"
  }
}
```

### Error Responses

#### 401 Unauthorized - Not Instructor

```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Only instructors can create courses",
  "statusCode": 401
}
```

#### 400 Bad Request - Validation Error

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title must be between 5 and 100 characters"
    },
    {
      "field": "price",
      "message": "Price must be between 0 and 999"
    }
  ],
  "statusCode": 400
}
```

---

## Endpoint 7: Update Course

### Specification

**HTTP Method**: PUT  
**Endpoint**: `/courses/:courseId`  
**Authentication**: Required - Course instructor/admin only  
**Description**: Update an existing course (only course instructor can update)

### Request

```http
PUT /api/courses/507f1f77bcf86cd799439020 HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Advanced React & Redux - Updated",
  "description": "Master React 18, Redux, and advanced state management",
  "price": 139.99,
  "discount": 10,
  "duration": 120
}
```

### Request Schema (Joi Validation)

```javascript
{
  title: Joi.string().min(5).max(100).optional(),
  description: Joi.string().min(20).max(1000).optional(),
  category: Joi.string().valid('web-development', 'data-science', 'mobile-dev').optional(),
  price: Joi.number().min(0).max(999).optional(),
  discount: Joi.number().min(0).max(100).optional(),
  duration: Joi.number().min(1).max(500).optional(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
  language: Joi.string().optional(),
  thumbnail: Joi.string().uri().optional(),
  requirements: Joi.array().items(Joi.string()).optional(),
  outcomes: Joi.array().items(Joi.string()).optional()
}
```

### Successful Response (200 OK)

```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "courseId": "507f1f77bcf86cd799439020",
    "title": "Advanced React & Redux - Updated",
    "description": "Master React 18, Redux, and advanced state management",
    "category": "web-development",
    "instructor": {
      "userId": "507f1f77bcf86cd799439012",
      "name": "Jane Smith"
    },
    "price": 139.99,
    "discount": 10,
    "discountedPrice": 125.99,
    "duration": 120,
    "level": "advanced",
    "language": "English",
    "enrollmentCount": 5,
    "rating": 4.5,
    "reviewCount": 2,
    "thumbnail": "https://cdn.example.com/courses/react-thumb.jpg",
    "requirements": ["JavaScript knowledge", "React basics"],
    "outcomes": ["Build scalable React apps", "Master Redux"],
    "createdAt": "2026-03-29T11:45:30.123Z",
    "updatedAt": "2026-03-29T12:30:15.456Z"
  }
}
```

### Error Responses

#### 404 Not Found

```json
{
  "success": false,
  "error": "COURSE_NOT_FOUND",
  "message": "Course not found",
  "statusCode": 404
}
```

#### 403 Forbidden - Not Instructor

```json
{
  "success": false,
  "error": "FORBIDDEN",
  "message": "You can only update your own courses",
  "statusCode": 403
}
```

#### 400 Bad Request - Validation Error

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "price",
      "message": "Price must be between 0 and 999"
    }
  ],
  "statusCode": 400
}
```

---

## Course Data Model

### Course Document Structure

```javascript
{
  _id: ObjectId,                    // MongoDB ID
  title: String,                    // Course title (5-100 chars)
  description: String,              // Course description (20-1000 chars)
  category: String,                 // Category enum
  instructorId: ObjectId,           // Reference to User
  price: Number,                    // Course price (0-999)
  discount: Number,                 // Discount percentage (0-100)
  duration: Number,                 // Course duration in minutes
  level: String,                    // Level enum
  language: String,                 // Course language
  thumbnail: String,                // Thumbnail URL
  requirements: [String],           // Course requirements
  outcomes: [String],               // Learning outcomes
  enrollmentCount: Number,          // Total enrollments
  rating: Number,                   // Average rating (0-5)
  reviewCount: Number,              // Total reviews
  createdAt: Date,                  // Creation timestamp
  updatedAt: Date                   // Last update timestamp
}
```

### Enumerations

**Category**:

- `web-development`
- `data-science`
- `mobile-dev`

**Level**:

- `beginner`
- `intermediate`
- `advanced`

---

## Authorization Rules

### Create Course

- ✅ Role = "instructor" → Allowed
- ✅ Role = "admin" → Allowed
- ❌ Role = "student" → 401 Unauthorized

### Get All Courses

- ✅ Public access → All users
- ✅ Unauthenticated → Allowed

### Get Course Detail

- ✅ Public access → All users
- ✅ Unauthenticated → Allowed

### Update Course

- ✅ Own course (instructor) → Allowed
- ✅ Role = "admin" → Allowed
- ❌ Other instructor's course → 403 Forbidden
- ❌ Role = "student" → 401 Unauthorized

---

## Testing Checklist

- [ ] Get all courses (200)
- [ ] Get all courses with pagination (200)
- [ ] Get all courses with filtering (200)
- [ ] Get course by ID (200)
- [ ] Get non-existent course (404)
- [ ] Get course with invalid ID (400)
- [ ] Create course as instructor (201)
- [ ] Create course as student (401)
- [ ] Create course with invalid data (400)
- [ ] Update own course (200)
- [ ] Update other's course (403)
- [ ] Update as student (401)
- [ ] Update with invalid data (400)

---

## Dependencies & Libraries

| Package  | Version | Purpose          |
| -------- | ------- | ---------------- |
| express  | 4.18.2+ | HTTP server      |
| mongoose | 7.0.0+  | MongoDB ODM      |
| joi      | 17.9.1+ | Input validation |

**All dependencies already in package.json** ✓

---

**Contract Version**: 1.0  
**Status**: ✅ Ready for Phase 4 Implementation
