import mongoose from 'mongoose';

/**
 * Lesson Model
 * Represents course content subdivisions containing educational material
 */

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
    },
    content: {
      type: String,
      required: [true, 'Lesson content is required'],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
      index: true,
    },
    position: {
      type: Number,
      required: [true, 'Lesson position is required'],
      min: [1, 'Position must be at least 1'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'lessons',
  }
);

// Compound unique index on courseId + position (prevents duplicate positions in same course)
lessonSchema.index({ courseId: 1, position: 1 }, { unique: true });

export default mongoose.model('Lesson', lessonSchema);
