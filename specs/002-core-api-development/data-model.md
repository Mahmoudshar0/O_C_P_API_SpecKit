# Data Model & Database Schema

**Phase**: 1 - Design & Contracts  
**Created**: March 29, 2026  
**Feature**: Phases 1-4 Core API Development  
**Branch**: 002-core-api-development

---

## Overview

The Online Course Platform data model consists of **5 core MongoDB collections** representing the key business entities. All relationships are defined using Mongoose references (foreign keys) with population for efficient queries.

**Collections**:

1. **User** - Platform users with role-based permissions
2. **Course** - Educational courses created by instructors
3. **Lesson** - Course content subdivisions
4. **Enrollment** - Student participation tracking
5. **Comment** - Student interactions and feedback

---

## Entity Definitions

### User Collection

**Purpose**: Represents all platform users (Instructors and Students)

**MongoDB Collection**: `users`

**Fields**:

| Field          | Type     | Required | Unique | Default | Purpose                                  |
| -------------- | -------- | -------- | ------ | ------- | ---------------------------------------- |
| `_id`          | ObjectId | ✅       | ✅     | Auto    | MongoDB document ID                      |
| `name`         | String   | ✅       | ❌     | -       | Full name (2-100 chars)                  |
| `email`        | String   | ✅       | ✅     | -       | Email address (validated format, unique) |
| `passwordHash` | String   | ✅       | ❌     | -       | Bcrypt hashed password (never plaintext) |
| `role`         | Enum     | ✅       | ❌     | Student | "Instructor" or "Student"                |
| `createdAt`    | Date     | ✅       | ❌     | now     | Creation timestamp                       |
| `updatedAt`    | Date     | ✅       | ❌     | now     | Last modification timestamp              |

**Indexes**:

- Primary: `_id` (auto)
- Unique: `email` (prevent duplicate registrations)
- Standard: `role` (query users by role)

**Mongoose Schema**:

```javascript
{
  name: { type: String, required: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^} ]\s@]+$/ },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Instructor', 'Student'], default: 'Student' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Relationships**:

- Instructor → Creates many Courses (1:M)
- Student → Has many Enrollments (1:M)
- Student → Creates many Comments (1:M)

---

### Course Collection

**Purpose**: Represents educational courses created and managed by instructors

**MongoDB Collection**: `courses`

**Fields**:

| Field          | Type     | Required | Reference | Purpose                                 |
| -------------- | -------- | -------- | --------- | --------------------------------------- |
| `_id`          | ObjectId | ✅       | -         | MongoDB document ID                     |
| `title`        | String   | ✅       | -         | Course title (5-200 chars)              |
| `description`  | String   | ✅       | -         | Course description (20-2000 chars)      |
| `instructorId` | ObjectId | ✅       | User.\_id | Reference to creating instructor        |
| `category`     | String   | ❌       | -         | Optional course category/classification |
| `createdAt`    | Date     | ✅       | -         | Creation timestamp                      |
| `updatedAt`    | Date     | ✅       | -         | Last modification timestamp             |

**Indexes**:

- Primary: `_id` (auto)
- Standard: `instructorId` (query courses by instructor)
- Standard: `category` (query courses by category)
- Text: `title`, `description` (full-text search in Phase 6)

**Mongoose Schema**:

```javascript
{
  title: { type: String, required: true, minlength: 5, maxlength: 200 },
  description: { type: String, required: true, minlength: 20, maxlength: 2000 },
  instructorId: { type: ObjectId, ref: 'User', required: true },
  category: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Relationships**:

- Course.instructorId → User.\_id (M:1) - every course has one instructor
- Course.\_id → Lesson.courseId (1:M) - one course has many lessons
- Course.\_id → Enrollment.courseId (1:M) - one course has many enrollments

---

### Lesson Collection

**Purpose**: Represents course content subdivisions containing educational material

**MongoDB Collection**: `lessons`

**Fields**:

| Field       | Type     | Required | Reference   | Purpose                                   |
| ----------- | -------- | -------- | ----------- | ----------------------------------------- |
| `_id`       | ObjectId | ✅       | -           | MongoDB document ID                       |
| `title`     | String   | ✅       | -           | Lesson title                              |
| `content`   | String   | ✅       | -           | Lesson content/body (Markdown or HTML)    |
| `courseId`  | ObjectId | ✅       | Course.\_id | Reference to parent course                |
| `position`  | Number   | ✅       | -           | Lesson order within course (1, 2, 3, ...) |
| `createdAt` | Date     | ✅       | -           | Creation timestamp                        |

**Indexes**:

- Primary: `_id` (auto)
- Standard: `courseId` (query lessons by course)
- Standard: `courseId + position` (compound: sorted lessons in course)

**Mongoose Schema**:

```javascript
{
  title: { type: String, required: true },
  content: { type: String, required: true },
  courseId: { type: ObjectId, ref: 'Course', required: true },
  position: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now }
}
```

**Validation**:

- Position must be unique per course (no two lessons with same position in same course)
- Content not empty (enforced at application level)

**Relationships**:

- Lesson.courseId → Course.\_id (M:1) - many lessons belong to one course
- Lesson.\_id → Comment.lessonId (1:M) - one lesson has many comments

---

### Enrollment Collection

**Purpose**: Tracks student participation in courses and learning progress

**MongoDB Collection**: `enrollments`

**Fields**:

| Field        | Type     | Required | Reference   | Purpose                                |
| ------------ | -------- | -------- | ----------- | -------------------------------------- |
| `_id`        | ObjectId | ✅       | -           | MongoDB document ID                    |
| `studentId`  | ObjectId | ✅       | User.\_id   | Reference to enrolling student         |
| `courseId`   | ObjectId | ✅       | Course.\_id | Reference to course                    |
| `enrolledAt` | Date     | ✅       | -           | Enrollment timestamp                   |
| `progress`   | Number   | ✅       | -           | Progress percentage (0-100, default 0) |

**Indexes**:

- Primary: `_id` (auto)
- Unique Compound: `studentId + courseId` (prevent duplicate enrollments)
- Standard: `studentId` (query enrollments by student)
- Standard: `courseId` (query enrollments by course)

**Mongoose Schema**:

```javascript
{
  studentId: { type: ObjectId, ref: 'User', required: true },
  courseId: { type: ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0, min: 0, max: 100 }
}
```

**Validation**:

- Compound unique index on (studentId, courseId) prevents duplicate enrollments
- Progress range: 0-100 represents percentage

**Relationships**:

- Enrollment.studentId → User.\_id (M:1) - many enrollments per student
- Enrollment.courseId → Course.\_id (M:1) - many enrollments per course

---

### Comment Collection

**Purpose**: Represents student questions, feedback, and interactions on lessons

**MongoDB Collection**: `comments`

**Fields**:

| Field       | Type     | Required | Reference   | Purpose                             |
| ----------- | -------- | -------- | ----------- | ----------------------------------- |
| `_id`       | ObjectId | ✅       | -           | MongoDB document ID                 |
| `content`   | String   | ✅       | -           | Comment text (1-500 chars)          |
| `studentId` | ObjectId | ✅       | User.\_id   | Reference to commenting student     |
| `lessonId`  | ObjectId | ✅       | Lesson.\_id | Reference to lesson being commented |
| `createdAt` | Date     | ✅       | -           | Creation timestamp                  |

**Indexes**:

- Primary: `_id` (auto)
- Standard: `lessonId` (query comments by lesson)
- Standard: `studentId` (query comments by student)
- Standard: `createdAt desc` (sorted by latest comments first)

**Mongoose Schema**:

```javascript
{
  content: { type: String, required: true, minlength: 1, maxlength: 500 },
  studentId: { type: ObjectId, ref: 'User', required: true },
  lessonId: { type: ObjectId, ref: 'Lesson', required: true },
  createdAt: { type: Date, default: Date.now }
}
```

**Relationships**:

- Comment.studentId → User.\_id (M:1) - many comments per student
- Comment.lessonId → Lesson.\_id (M:1) - many comments per lesson

---

## Entity Relationships (ER Diagram)

```
┌─────────────────────┐
│       User          │
│  _id, name, email   │
│   password, role    │
└──────────┬──────────┘
           │
           ├─── (1:M) ──→ "instructor for" ──→ Course
           ├─── (1:M) ──→ "enrolls in" ──→ Enrollment
           └─── (1:M) ──→ "creates" ──→ Comment

┌──────────────────────────┐
│       Course             │
│ _id, title, description  │
│ instructorId, category   │
└──────────┬───────────────┘
           │
           ├─── (1:M) ──→ Course contains ──→ Lesson
           └─── (1:M) ──→ Course has ──→ Enrollment

┌──────────────────────┐
│       Lesson         │
│ _id, title, content  │
│ courseId, position   │
└──────────┬───────────┘
           │
           └─── (1:M) ──→ Lesson has ──→ Comment

┌──────────────────────────┐
│     Enrollment           │
│ _id, studentId, courseId │
│ enrolledAt, progress     │
└──────────────────────────┘

┌─────────────────────────────┐
│       Comment               │
│ _id, content, studentId     │
│ lessonId, createdAt         │
└─────────────────────────────┘
```

---

## Key Constraints

### Data Integrity Constraints

1. **Unique Email**: No two users can have same email address

   - Mongoose: `unique: true` on email field
   - Database: unique index on email

2. **No Duplicate Enrollments**: Cannot enroll same student in same course twice

   - Mongoose: compound unique index on (studentId, courseId)
   - Validation: return 409 Conflict if already enrolled

3. **Valid Roles**: Users only have "Instructor" or "Student" role

   - Mongoose: `enum: ['Instructor', 'Student']`

4. **Lesson Position Uniqueness**: Lessons in same course must have unique positions

   - Application logic enforces (can later add unique compound index)

5. **Reference Integrity**: Foreign keys reference existing documents
   - Mongoose: `ref` field relationships
   - Validation: application-level checks on user input

### Field Constraints

| Field               | Min | Max  | Pattern      | Notes                       |
| ------------------- | --- | ---- | ------------ | --------------------------- |
| User.name           | 2   | 100  | -            | -                           |
| Course.title        | 5   | 200  | -            | -                           |
| Course.description  | 20  | 2000 | -            | -                           |
| Lesson.position     | 1   | ∞    | Integer      | Positive, unique per course |
| Enrollment.progress | 0   | 100  | Integer      | Percentage 0-100%           |
| Comment.content     | 1   | 500  | -            | -                           |
| User.email          | -   | -    | Email format | Unique                      |
| User.passwordHash   | -   | -    | Bcrypt hash  | 60 chars                    |

---

## Database Indexes (Performance Optimization)

**Single Field Indexes**:

- `users.email` - frequent: login queries
- `courses.instructorId` - frequent: instructor's course list
- `lessons.courseId` - frequent: course's lessons retrieval
- `enrollments.studentId` - frequent: student's enrollments
- `enrollments.courseId` - frequent: course subscribers
- `comments.lessonId` - frequent: lesson's comments list

**Compound Indexes**:

- `enrollments(studentId, courseId)` - unique constraint + query efficiency
- `lessons(courseId, position)` - sorted lessons in course

**Index Strategy**: Index high-cardinality fields (email, IDs) and frequent query combinations

---

## Timestamps

All entities include `createdAt` and `updatedAt` timestamps (except Enrollment and Comment which only track creation):

- `createdAt`: Set on document creation, never changes
- `updatedAt`: Set on creation, updated on every modification (Mongoose hook)

**Benefits**:

- Audit trail: know when objects were created/modified
- Sorting: find newest courses, latest comments
- Soft deletes: future enhancement (add `deletedAt` field)

---

## Future Extensions (Out of Scope for Phase 1-4)

These entities and fields can be added in later phases:

1. **Course Progress Analytics** (Phase 6):

   - Add `completedAt` to Enrollment
   - Add `lastAccessedAt` to Enrollment
   - Add `expectedCompletionDate`, `difficulty` to Course

2. **Advanced Interactions** (Phase 6):

   - Add `likes` counter to Comment
   - Add `replies` sub-collection (nested comments)
   - Add `upvotes`/`downvotes` to Comments

3. **Ratings & Reviews** (Phase 6):

   - New `Rating` collection (studentId, courseId, rating, review)
   - Average rating on Course

4. **Search & Discovery** (Phase 6):

   - Text indexes on Course.title, Course.description, Lesson.content
   - Category browsing

5. **User Profiles** (Phase 6):
   - Add `bio`, `profilePicture`, `biography` to User
   - Add `instructorBio` for Instructors specifically

---

**Status**: ✅ **Data Model Definition Complete**  
**Ready for**: Phase 1 Implementation (create Mongoose models)  
**Next**: Create contracts/ directory with endpoint API specifications
