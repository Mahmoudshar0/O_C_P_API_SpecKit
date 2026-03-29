import mongoose from 'mongoose';
import Comment from '../models/Comment.js';
import Lesson from '../models/Lesson.js';
import { errorResponse } from '../utils/response.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const create = async (req, res, next) => {
  try {
    const { lessonId } = req.params;

    if (!isValidObjectId(lessonId)) {
      return res.status(400).json(errorResponse('INVALID_ID', 'Invalid lesson ID format', 400));
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json(errorResponse('LESSON_NOT_FOUND', 'Lesson not found', 404));
    }

    const { content } = req.validated || req.body;

    const comment = await Comment.create({
      studentId: req.user.userId,
      lessonId,
      content,
    });

    const populated = await Comment.findById(comment._id).populate(
      'studentId',
      'firstName lastName email'
    );

    const student = populated.studentId;

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: {
        commentId: populated._id,
        lessonId: populated.lessonId,
        content: populated.content,
        student: {
          userId: student._id,
          name: [student.firstName, student.lastName].filter(Boolean).join(' '),
          email: student.email,
        },
        createdAt: populated.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { page, limit } = req.validatedQuery || req.query;

    if (!isValidObjectId(lessonId)) {
      return res.status(400).json(errorResponse('INVALID_ID', 'Invalid lesson ID format', 400));
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json(errorResponse('LESSON_NOT_FOUND', 'Lesson not found', 404));
    }

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ lessonId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('studentId', 'firstName lastName email')
        .lean(),
      Comment.countDocuments({ lessonId }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      message: 'Comments retrieved successfully',
      data: {
        comments: comments.map((c) => ({
          commentId: c._id,
          lessonId: c.lessonId,
          content: c.content,
          student: {
            userId: c.studentId?._id,
            name: c.studentId
              ? [c.studentId.firstName, c.studentId.lastName].filter(Boolean).join(' ')
              : '',
            email: c.studentId?.email,
          },
          createdAt: c.createdAt,
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalComments: total,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export { create, list };
