import mongoose from 'mongoose';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import { errorResponse } from '../utils/response.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const create = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json(errorResponse('INVALID_ID', 'Invalid course ID format', 400));
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json(errorResponse('COURSE_NOT_FOUND', 'Course not found', 404));
    }

    const ownerId = course.instructorId.toString();
    const isOwner = ownerId === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json(errorResponse('FORBIDDEN', 'Only the course instructor can add lessons', 403));
    }

    const { title, content, position } = req.validated || req.body;

    try {
      const lesson = await Lesson.create({
        title,
        content,
        courseId,
        position,
      });

      res.status(201).json({
        success: true,
        message: 'Lesson created successfully',
        data: {
          lessonId: lesson._id,
          title: lesson.title,
          content: lesson.content,
          courseId: lesson.courseId,
          position: lesson.position,
          createdAt: lesson.createdAt,
        },
      });
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(409)
          .json(
            errorResponse('DUPLICATE_POSITION', 'A lesson with this position already exists', 409)
          );
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const listByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json(errorResponse('INVALID_ID', 'Invalid course ID format', 400));
    }

    const course = await Course.findById(courseId).populate(
      'instructorId',
      'firstName lastName email'
    );

    if (!course) {
      return res.status(404).json(errorResponse('COURSE_NOT_FOUND', 'Course not found', 404));
    }

    const lessons = await Lesson.find({ courseId }).sort({ position: 1 }).lean();

    res.status(200).json({
      success: true,
      message: 'Lessons retrieved successfully',
      data: {
        lessons: lessons.map((l) => ({
          lessonId: l._id,
          title: l.title,
          content: l.content,
          courseId: l.courseId,
          position: l.position,
          createdAt: l.createdAt,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export { create, listByCourse };
