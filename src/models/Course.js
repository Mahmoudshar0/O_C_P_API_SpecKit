import mongoose from 'mongoose';

/**
 * Course Model
 * Represents educational courses created by instructors
 */

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description must not exceed 2000 characters'],
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor ID is required'],
      index: true,
    },
    category: {
      type: String,
      enum: {
        values: ['web-development', 'data-science', 'mobile-dev'],
        message: '{VALUE} is not a valid category',
      },
      index: true,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'courses',
  }
);

// Compound index for instructorId + category
courseSchema.index({ instructorId: 1, category: 1 });

export default mongoose.model('Course', courseSchema);
