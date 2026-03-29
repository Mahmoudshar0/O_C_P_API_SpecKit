import mongoose from 'mongoose';

/**
 * Enrollment Model
 * Tracks student participation in courses and learning progress
 */

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress must be at least 0'],
      max: [100, 'Progress must not exceed 100'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'enrollments',
  }
);

// Compound unique index to prevent duplicate enrollments (student can only enroll once per course)
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
