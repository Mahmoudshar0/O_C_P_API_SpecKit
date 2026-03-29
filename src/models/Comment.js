import mongoose from 'mongoose';

/**
 * Comment Model
 * Represents student interactions and feedback on lessons
 */

const commentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
      index: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: [true, 'Lesson ID is required'],
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      minlength: [1, 'Comment must not be empty'],
      maxlength: [500, 'Comment must not exceed 500 characters'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'comments',
  }
);

// Compound index on lessonId + createdAt for efficient comment retrieval (newest first)
commentSchema.index({ lessonId: 1, createdAt: -1 });

export default mongoose.model('Comment', commentSchema);
