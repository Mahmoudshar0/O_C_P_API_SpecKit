# Data Model: Online Course Platform Backend

**Status**: Design Phase 1  
**Date**: 2026-03-29  
**Purpose**: Define entity definitions, relationships, and Mongoose schema structure

---

## Entity Overview

The Online Course Platform Backend manages relationships between **Users**, **Courses**, **Lessons**, **Enrollments**, and **Comments**. This section documents each entity with attributes, validation rules, and relationships.

### Core Entities

1. **User** - Platform stakeholder (Instructor or Student)
2. **Course** - Educational content managed by Instructor
3. **Lesson** - Individual module within a Course
4. **Enrollment** - Student's registration for a Course
5. **Comment** - Discussion/feedback on a Lesson

---

## Entity Definitions

### User

**Purpose**: Represents a platform participant (Instructor or Student)

**Attributes**:

- `_id` (ObjectId): MongoDB auto-generated unique identifier
- `name` (String, required): Full name; 2-100 characters
- `email` (String, required, unique): Unique email; validated email format; case-insensitive
- `password` (String, required): Bcrypt hash; minimum 8 characters when set
- `role` (String, enum: ["Instructor", "Student"], required): Determines permissions
- `bio` (String, optional): Profile biography; max 500 characters
- `createdAt` (Date, auto): Creation timestamp
- `updatedAt` (Date, auto): Last modification timestamp

**Indexes**:

- `email` (unique): Prevents duplicate registrations; enables fast login lookup
- `createdAt` (descending): For user listing/pagination

**Validation Rules**:

- Email: Must be valid email format; unique across system
- Password: Minimum 8 characters; stored as bcrypt hash (never plaintext)
- Name: Minimum 2 characters, maximum 100 characters
- Role: Only "Instructor" or "Student"; enforced by enum

**Mongoose Schema Notes**:

```javascript
new Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Instructor', 'Student'], required: true },
  bio: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

---

### Course

**Purpose**: Educational content container managed by an Instructor

**Attributes**:

- `_id` (ObjectId): Unique identifier
- `title` (String, required): Course name; 5-200 characters
- `description` (String, required): Detailed course overview; 20-2000 characters
- `instructorId` (ObjectId, required, ref: User): Foreign key linking to Instructor User
- `category` (String, optional): Course topic/category; predefined values (Phase 2+)
- `createdAt` (Date, auto): Creation timestamp
- `updatedAt` (Date, auto): Last modification timestamp

**Indexes**:

- `instructorId` (ascending): For fetching Instructor's courses
- `createdAt` (descending): For course listing/sorting
- `title` (text): For full-text search (Phase 2+)

**Validation Rules**:

- Title: 5-200 characters; unique per Instructor (Phase 2)
- Description: 20-2000 characters
- InstructorId: Must reference existing User with role="Instructor"
- Only Instructor role can create courses (enforced in controller layer)

**Relationships**:

- 1 Course : Many Lessons (one-to-many)
- 1 Course : Many Enrollments (one-to-many)
- Course → User (instructorId)

**Mongoose Schema Notes**:

```javascript
new Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 200 },
  description: { type: String, required: true, minlength: 20, maxlength: 2000 },
  instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

---

### Lesson

**Purpose**: Individual learning module within a Course

**Attributes**:

- `_id` (ObjectId): Unique identifier
- `title` (String, required): Lesson name; 3-150 characters
- `content` (String, required): Lesson material/instructions; 10-10000 characters
- `courseId` (ObjectId, required, ref: Course): Foreign key linking to Course
- `position` (Number, optional): Order within course; for sequencing
- `createdAt` (Date, auto): Creation timestamp
- `updatedAt` (Date, auto): Last modification timestamp

**Indexes**:

- `courseId` (ascending): For fetching Lessons of a Course
- `position` (ascending): For ordered lesson retrieval
- `courseId` + `position` (compound): For efficient sequential access

**Validation Rules**:

- Title: 3-150 characters
- Content: 10-10000 characters (enables varied content lengths)
- CourseId: Must reference existing Course
- only Instructor who created the Course can add/edit Lessons (enforced in controller)

**Relationships**:

- 1 Lesson : Many Comments (one-to-many)
- Lesson → Course (courseId)

**Mongoose Schema Notes**:

```javascript
new Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 150 },
  content: { type: String, required: true, minlength: 10, maxlength: 10000 },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  position: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

---

### Enrollment

**Purpose**: Student's registration for a Course

**Attributes**:

- `_id` (ObjectId): Unique identifier
- `studentId` (ObjectId, required, ref: User): Foreign key linking to Student User
- `courseId` (ObjectId, required, ref: Course): Foreign key linking to Course
- `enrolledAt` (Date, auto): Enrollment timestamp
- `completedAt` (Date, optional): Course completion timestamp (Phase 2+)
- `progress` (Number, optional): Percentage progress 0-100 (Phase 2+)

**Indexes**:

- `studentId` (ascending): For fetching Student's enrollments
- `courseId` (ascending): For counting Course enrollments
- `studentId` + `courseId` (compound, unique): Prevents duplicate enrollments

**Validation Rules**:

- StudentId: Must reference existing User with role="Student"
- CourseId: Must reference existing Course
- Unique constraint: (studentId, courseId) prevents same student enrolling twice
- Only Student role can enroll (enforced in controller)

**Relationships**:

- Enrollment → User (studentId)
- Enrollment → Course (courseId)
- N Students : M Courses (many-to-many relationship, owned by Enrollment)

**Mongoose Schema Notes**:

```javascript
new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    progress: { type: Number, min: 0, max: 100 },
  },
  {
    unique: [['studentId', 'courseId'], 'Student already enrolled in this course'],
  }
);
```

---

### Comment

**Purpose**: Student discussion/feedback on a Lesson

**Attributes**:

- `_id` (ObjectId): Unique identifier
- `content` (String, required): Comment text; 1-2000 characters
- `studentId` (ObjectId, required, ref: User): Foreign key linking to Student User
- `lessonId` (ObjectId, required, ref: Lesson): Foreign key linking to Lesson
- `createdAt` (Date, auto): Creation timestamp
- `updatedAt` (Date, auto): Last modification timestamp

**Indexes**:

- `lessonId` (ascending): For fetching Comments on a Lesson
- `studentId` (ascending): For fetching Student's comments
- `createdAt` (descending): For chronological comment retrieval

**Validation Rules**:

- Content: 1-2000 characters
- StudentId: Must reference existing User with role="Student"
- LessonId: Must reference existing Lesson
- Only Student role can post comments (enforced in controller)

**Relationships**:

- Comment → User (studentId)
- Comment → Lesson (lessonId)
- 1 Lesson : Many Comments (one-to-many)

**Mongoose Schema Notes**:

```javascript
new Schema({
  content: { type: String, required: true, minlength: 1, maxlength: 2000 },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

---

## Relationship Diagram

```
User (1) ─────────────────────── (M) Course
         ← instructorId


User (M) ──────────────────────── (M) Course
         └─ Enrollment ──────────┘
         (enrollments represent Student-Course link)


Course (1) ─────────────────────── (M) Lesson


Lesson (1) ─────────────────────── (M) Comment
        ← lessonId              ↓ studentId
                                 ↓
                              User (M)
```

---

## Schema Migration Strategy

**Phase 0**: No migrations needed; foundation does not create database collections.

**Phase 1** (Database Design):

- Create Mongoose model files corresponding to each entity
- Mongoose auto-creates collections on first use
- Document timestamp defaults and auto-indexing behavior

**Phase 2+** (Future Changes):

- Version schema changes with numbered migrations (e.g., `001_add_category_to_course.js`)
- Always include data backup before migration
- Test migrations on staging before production

---

## Validation & Constraints Summary

| Entity     | Key Constraints                  | Notes                       |
| ---------- | -------------------------------- | --------------------------- |
| User       | Email unique, password bcrypt    | Role determines permissions |
| Course     | instructorId required            | Only Instructor can create  |
| Lesson     | courseId required, title+content | Only Instructor can create  |
| Enrollment | (studentId, courseId) unique     | Only Student can enroll     |
| Comment    | content 1-2000 chars             | Only Student can comment    |

All constraints will be enforced at both **Mongoose schema layer** and **controller/validation layer** (two-layer defense per Constitution Principle III & V).
