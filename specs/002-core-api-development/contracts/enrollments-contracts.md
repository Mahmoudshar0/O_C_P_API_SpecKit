# Enrollments API Contracts

**Phase**: 1 - Design & Contracts  
**Purpose**: Define REST API contracts for course enrollment management  
**Last Updated**: March 29, 2026  
**Branch**: 002-core-api-development

---

## Overview

Enrollment endpoints handle student enrollments in courses, retrieval of student courses, and unenrollment management. All enrollment endpoints require authentication.

**Base URL**: `http://localhost:5000/api`  
**Authentication**: Required on all endpoints (Bearer token in Authorization header)

---

## Endpoint 8: Enroll in Course

### Specification

**HTTP Method**: POST  
**Endpoint**: `/enrollments`  
**Authentication**: Required - All authenticated users  
**Description**: Enroll a student in a course (student role recommended)

### Request

```http
POST /api/enrollments HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "courseId": "507f1f77bcf86cd799439011"
}
```

### Request Schema (Joi Validation)

```javascript
{
  courseId: Joi.string().length(24).hex().required(); // Valid MongoDB ObjectId
}
```

### Successful Response (201 Created)

```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "data": {
    "enrollmentId": "507f1f77bcf86cd799439030",
    "studentId": "507f1f77bcf86cd799439015",
    "courseId": "507f1f77bcf86cd799439011",
    "courseName": "Complete Web Development Bootcamp",
    "instructorName": "Jane Smith",
    "enrollmentDate": "2026-03-29T12:00:00.000Z",
    "status": "active",
    "progress": 0,
    "certificateIssued": false
  }
}
```

### Error Responses

#### 401 Unauthorized - Not Authenticated

```json
{
  "success": false,
  "error": "NO_TOKEN",
  "message": "Authorization token is required",
  "statusCode": 401
}
```

#### 404 Not Found - Course Not Found

```json
{
  "success": false,
  "error": "COURSE_NOT_FOUND",
  "message": "Course not found",
  "statusCode": 404
}
```

#### 409 Conflict - Already Enrolled

```json
{
  "success": false,
  "error": "ALREADY_ENROLLED",
  "message": "You are already enrolled in this course",
  "statusCode": 409
}
```

#### 400 Bad Request - Invalid Course ID

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid course ID format",
  "statusCode": 400
}
```

---

## Endpoint 9: Get Student's Courses

### Specification

**HTTP Method**: GET  
**Endpoint**: `/enrollments/my-courses`  
**Authentication**: Required - All authenticated users  
**Description**: Retrieve all courses enrolled by the authenticated student

### Request

```http
GET /api/enrollments/my-courses?page=1&limit=10&status=active HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Query Parameters

```
page=1          (optional) Page number, default: 1
limit=10        (optional) Results per page, default: 10, max: 50
status=active   (optional) Filter by status: "active", "completed", "dropped"
sortBy=enrollmentDate (optional) Sort by: "enrollmentDate", "progress", "courseName"
order=desc      (optional) Sort order: "asc", "desc", default: "desc"
```

### Successful Response (200 OK)

```json
{
  "success": true,
  "message": "Student courses retrieved successfully",
  "data": {
    "enrollments": [
      {
        "enrollmentId": "507f1f77bcf86cd799439030",
        "studentId": "507f1f77bcf86cd799439015",
        "courseId": "507f1f77bcf86cd799439011",
        "courseName": "Complete Web Development Bootcamp",
        "instructorName": "Jane Smith",
        "category": "web-development",
        "thumbnail": "https://cdn.example.com/courses/web-dev-thumb.jpg",
        "price": 99.99,
        "enrollmentDate": "2026-03-20T10:30:00.000Z",
        "status": "active",
        "progress": 35,
        "completionDate": null,
        "certificateIssued": false,
        "certificateUrl": null
      },
      {
        "enrollmentId": "507f1f77bcf86cd799439031",
        "studentId": "507f1f77bcf86cd799439015",
        "courseId": "507f1f77bcf86cd799439013",
        "courseName": "Python For Data Science",
        "instructorName": "Dr. Ahmed Hassan",
        "category": "data-science",
        "thumbnail": "https://cdn.example.com/courses/python-ds-thumb.jpg",
        "price": 149.99,
        "enrollmentDate": "2026-03-15T14:22:00.000Z",
        "status": "active",
        "progress": 65,
        "completionDate": null,
        "certificateIssued": false,
        "certificateUrl": null
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalEnrollments": 2,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

### Error Responses

#### 401 Unauthorized

```json
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "Token is invalid or expired",
  "statusCode": 401
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": "SERVER_ERROR",
  "message": "Failed to retrieve enrollments",
  "statusCode": 500
}
```

---

## Endpoint 10: Get Enrollment Details

### Specification

**HTTP Method**: GET  
**Endpoint**: `/enrollments/:enrollmentId`  
**Authentication**: Required - All authenticated users (own enrollment or admin)  
**Description**: Retrieve detailed information about a specific enrollment

### Request

```http
GET /api/enrollments/507f1f77bcf86cd799439030 HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### URL Parameters

```
enrollmentId: MongoDB ObjectId (24-char hex string)
```

### Successful Response (200 OK)

```json
{
  "success": true,
  "message": "Enrollment retrieved successfully",
  "data": {
    "enrollmentId": "507f1f77bcf86cd799439030",
    "studentId": "507f1f77bcf86cd799439015",
    "studentName": "John Doe",
    "studentEmail": "john@example.com",
    "courseId": "507f1f77bcf86cd799439011",
    "courseName": "Complete Web Development Bootcamp",
    "instructorId": "507f1f77bcf86cd799439012",
    "instructorName": "Jane Smith",
    "category": "web-development",
    "description": "Learn HTML, CSS, JavaScript, and modern frameworks",
    "price": 99.99,
    "enrollmentDate": "2026-03-20T10:30:00.000Z",
    "status": "active",
    "progress": 35,
    "progressDetails": {
      "completedLessons": 35,
      "totalLessons": 96,
      "completedModules": 3,
      "totalModules": 8
    },
    "completionDate": null,
    "certificateIssued": false,
    "certificateUrl": null,
    "lastAccessedAt": "2026-03-29T09:15:30.000Z",
    "lessonProgress": [
      {
        "lessonId": "les-001",
        "lessonTitle": "HTML Basics",
        "moduleId": "mod-001",
        "completed": true,
        "completedAt": "2026-03-21T11:30:00.000Z"
      },
      {
        "lessonId": "les-015",
        "lessonTitle": "Responsive Design",
        "moduleId": "mod-002",
        "completed": false,
        "completedAt": null
      }
    ]
  }
}
```

### Error Responses

#### 404 Not Found

```json
{
  "success": false,
  "error": "ENROLLMENT_NOT_FOUND",
  "message": "Enrollment not found",
  "statusCode": 404
}
```

#### 403 Forbidden - Not Own Enrollment

```json
{
  "success": false,
  "error": "FORBIDDEN",
  "message": "You can only view your own enrollments",
  "statusCode": 403
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "Token is invalid or expired",
  "statusCode": 401
}
```

---

## Endpoint 11: Unenroll from Course

### Specification

**HTTP Method**: DELETE  
**Endpoint**: `/enrollments/:enrollmentId`  
**Authentication**: Required - Student or admin  
**Description**: Unenroll student from a course (removes enrollment record)

### Request

```http
DELETE /api/enrollments/507f1f77bcf86cd799439030 HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### URL Parameters

```
enrollmentId: MongoDB ObjectId (24-char hex string)
```

### Successful Response (200 OK)

```json
{
  "success": true,
  "message": "Successfully unenrolled from course",
  "data": {
    "enrollmentId": "507f1f77bcf86cd799439030",
    "courseId": "507f1f77bcf86cd799439011",
    "courseName": "Complete Web Development Bootcamp",
    "studentId": "507f1f77bcf86cd799439015",
    "status": "dropped",
    "unenrolledAt": "2026-03-29T13:45:00.000Z"
  }
}
```

### Error Responses

#### 404 Not Found

```json
{
  "success": false,
  "error": "ENROLLMENT_NOT_FOUND",
  "message": "Enrollment not found",
  "statusCode": 404
}
```

#### 403 Forbidden - Not Own Enrollment

```json
{
  "success": false,
  "error": "FORBIDDEN",
  "message": "You can only unenroll from your own courses",
  "statusCode": 403
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "Token is invalid or expired",
  "statusCode": 401
}
```

---

## Enrollment Data Model

### Enrollment Document Structure

```javascript
{
  _id: ObjectId,                    // MongoDB ID
  studentId: ObjectId,              // Reference to User (student)
  courseId: ObjectId,               // Reference to Course
  enrollmentDate: Date,             // Enrollment timestamp
  status: String,                   // Status enum
  progress: Number,                 // Progress percentage (0-100)
  completedLessons: [ObjectId],     // Array of completed lesson IDs
  completionDate: Date,             // Completion timestamp (if completed)
  certificateIssued: Boolean,       // Certificate issued flag
  certificateUrl: String,           // URL to certificate (if issued)
  lastAccessedAt: Date,             // Last access timestamp
  notes: String,                    // Optional student notes
  createdAt: Date,                  // Creation timestamp
  updatedAt: Date                   // Last update timestamp
}
```

### Enumerations

**Status**:

- `active` - Currently enrolled
- `completed` - Course completed
- `dropped` - Unenrolled

---

## Authorization Rules

### Enroll in Course

- ✅ Authenticated user → Allowed
- ❌ Not authenticated → 401

### Get My Courses

- ✅ Own enrollments → Allowed
- ✅ Admin → Allowed
- ✅ Authenticated user → Allowed (returns only own)

### Get Enrollment Details

- ✅ Own enrollment → Allowed
- ✅ Admin → Allowed
- ❌ Other user's enrollment → 403 Forbidden

### Unenroll from Course

- ✅ Own enrollment → Allowed
- ✅ Admin → Allowed
- ❌ Other user's enrollment → 403 Forbidden
- ❌ Not authenticated → 401

---

## Enrollment Business Logic

### Enroll in Course

```
1. Validate courseId
   ├─ INVALID → 400 Bad Request
   └─ VALID → Continue

2. Check if course exists
   ├─ NOT FOUND → 404 Not Found
   └─ FOUND → Continue

3. Check if already enrolled
   ├─ YES → 409 Conflict
   └─ NO → Continue

4. Create enrollment record
   ├─ Set status = "active"
   ├─ Set progress = 0
   ├─ Set enrollmentDate = now()
   └─ SAVE → Continue

5. Increment course enrollmentCount
6. Return 201 Created + enrollment data
```

### Get My Courses

```
1. Extract userId from JWT token
2. Query enrollments where studentId = userId
3. Apply pagination/filtering/sorting
4. Populate course details (from courses collection)
5. Return 200 OK + paginated results
```

### Get Enrollment Details

```
1. Validate enrollmentId
   ├─ INVALID → 400 Bad Request
   └─ VALID → Continue

2. Query enrollment by enrollmentId
   ├─ NOT FOUND → 404 Not Found
   └─ FOUND → Continue

3. Check authorization
   ├─ Own enrollment OR admin → Continue
   └─ OTHER → 403 Forbidden

4. Populate course & student details
5. Return 200 OK + full enrollment data
```

### Unenroll from Course

```
1. Validate enrollmentId
   ├─ INVALID → 400 Bad Request
   └─ VALID → Continue

2. Query enrollment by enrollmentId
   ├─ NOT FOUND → 404 Not Found
   └─ FOUND → Continue

3. Check authorization
   ├─ Own enrollment OR admin → Continue
   └─ OTHER → 403 Forbidden

4. Update enrollment
   ├─ Set status = "dropped"
   ├─ Set unenrolledAt = now()
   └─ SAVE

5. Decrement course enrollmentCount
6. Return 200 OK + status
```

---

## Validation Rules

### Course Enrollment Limits

- ✅ No student enrollment limit
- ✅ Multiple enrollments allowed
- ✅ Re-enrollment not allowed (409 if already enrolled)

### Progress Tracking

- Progress = (completedLessons.length / totalLessons) \* 100
- Updated when student completes a lesson
- Ranges from 0-100

### Certificate Issuance

- Issued when progress = 100% (all lessons completed)
- Default: Not issued initially
- Future implementation: Auto-issue on completion

---

## Testing Checklist

- [ ] Enroll in course successfully (201)
- [ ] Enroll in already-enrolled course (409)
- [ ] Enroll in non-existent course (404)
- [ ] Enroll without authentication (401)
- [ ] Get my courses (200)
- [ ] Get my courses with pagination (200)
- [ ] Get my courses with status filter (200)
- [ ] Get enrollment details (own) (200)
- [ ] Get enrollment details (others) (403)
- [ ] Get non-existent enrollment (404)
- [ ] Unenroll from course (own) (200)
- [ ] Unenroll from course (others) (403)
- [ ] Unenroll with invalid ID (400)
- [ ] Unenroll without authentication (401)

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
