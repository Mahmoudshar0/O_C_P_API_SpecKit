import mongoose from 'mongoose';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { errorResponse } from '../utils/response.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const instructorDisplayName = (user) => {
  if (!user) {
    return '';
  }
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
};

const enroll = async (req, res, next) => {
  try {
    const { courseId } = req.validated || req.body;

    if (!isValidObjectId(courseId)) {
      return res
        .status(400)
        .json(errorResponse('VALIDATION_ERROR', 'Invalid course ID format', 400));
    }

    const course = await Course.findById(courseId).populate('instructorId', 'firstName lastName');
    if (!course) {
      return res.status(404).json(errorResponse('COURSE_NOT_FOUND', 'Course not found', 404));
    }

    const existing = await Enrollment.findOne({
      studentId: req.user.userId,
      courseId,
    });

    if (existing) {
      return res
        .status(409)
        .json(errorResponse('ALREADY_ENROLLED', 'You are already enrolled in this course', 409));
    }

    let enrollment;
    try {
      enrollment = await Enrollment.create({
        studentId: req.user.userId,
        courseId,
        progress: 0,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(409)
          .json(errorResponse('ALREADY_ENROLLED', 'You are already enrolled in this course', 409));
      }
      throw err;
    }

    await Course.updateOne({ _id: courseId }, { $inc: { enrollmentCount: 1 } });

    const instructor = course.instructorId;

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        enrollmentId: enrollment._id,
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        courseName: course.title,
        instructorName: instructorDisplayName(instructor),
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
      },
    });
  } catch (error) {
    next(error);
  }
};

const listMyEnrollments = async (req, res, next) => {
  try {
    const { page, limit } = req.validatedQuery || req.query;

    const filter = { studentId: req.user.userId };
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      Enrollment.find(filter)
        .sort({ enrolledAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'courseId',
          select: 'title category enrollmentCount instructorId',
          populate: { path: 'instructorId', select: 'firstName lastName' },
        })
        .lean(),
      Enrollment.countDocuments(filter),
    ]);

    const enrollments = rows.map((e) => {
      const c = e.courseId;
      return {
        enrollmentId: e._id,
        studentId: e.studentId,
        courseId: c?._id || e.courseId,
        courseName: c?.title || '',
        instructorName: instructorDisplayName(c?.instructorId),
        category: c?.category,
        enrollmentDate: e.enrolledAt,
        progress: e.progress,
      };
    });

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      message: 'Student courses retrieved successfully',
      data: {
        enrollments,
        pagination: {
          currentPage: page,
          totalPages,
          totalEnrollments: total,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getEnrollment = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;

    if (!isValidObjectId(enrollmentId)) {
      return res.status(400).json(errorResponse('INVALID_ID', 'Invalid enrollment ID format', 400));
    }

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate({
        path: 'courseId',
        select: 'title description category instructorId',
        populate: { path: 'instructorId', select: 'firstName lastName email' },
      })
      .populate('studentId', 'firstName lastName email');

    if (!enrollment) {
      return res
        .status(404)
        .json(errorResponse('ENROLLMENT_NOT_FOUND', 'Enrollment not found', 404));
    }

    const isOwner = enrollment.studentId._id.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json(errorResponse('FORBIDDEN', 'You can only view your own enrollments', 403));
    }

    const student = enrollment.studentId;
    const course = enrollment.courseId;

    res.status(200).json({
      success: true,
      message: 'Enrollment retrieved successfully',
      data: {
        enrollmentId: enrollment._id,
        studentId: student._id,
        studentName: [student.firstName, student.lastName].filter(Boolean).join(' '),
        studentEmail: student.email,
        courseId: course._id,
        courseName: course.title,
        description: course.description,
        category: course.category,
        instructorId: course.instructorId?._id,
        instructorName: instructorDisplayName(course.instructorId),
        enrollmentDate: enrollment.enrolledAt,
        progress: enrollment.progress,
      },
    });
  } catch (error) {
    next(error);
  }
};

const unenroll = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;

    if (!isValidObjectId(enrollmentId)) {
      return res.status(400).json(errorResponse('INVALID_ID', 'Invalid enrollment ID format', 400));
    }

    const enrollment = await Enrollment.findById(enrollmentId).populate(
      'courseId',
      'title instructorId'
    );

    if (!enrollment) {
      return res
        .status(404)
        .json(errorResponse('ENROLLMENT_NOT_FOUND', 'Enrollment not found', 404));
    }

    const isOwner = enrollment.studentId.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json(errorResponse('FORBIDDEN', 'You can only unenroll from your own courses', 403));
    }

    const courseId = enrollment.courseId._id;
    const courseTitle = enrollment.courseId.title;

    await Enrollment.deleteOne({ _id: enrollment._id });
    await Course.updateOne({ _id: courseId }, { $inc: { enrollmentCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course',
      data: {
        enrollmentId,
        courseId,
        courseName: courseTitle,
        studentId: req.user.userId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { enroll, listMyEnrollments, getEnrollment, unenroll };
