import mongoose from 'mongoose';
import Course from '../models/Course.js';
import { errorResponse } from '../utils/response.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const formatInstructor = (user) => {
  if (!user || !user._id) {
    return null;
  }
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Unknown';
  return {
    userId: user._id,
    name,
  };
};

const toCourseDto = (course, instructorUser) => ({
  courseId: course._id,
  title: course.title,
  description: course.description,
  category: course.category,
  instructor: formatInstructor(instructorUser || course.instructorId),
  enrollmentCount: course.enrollmentCount ?? 0,
  createdAt: course.createdAt,
  updatedAt: course.updatedAt,
});

const create = async (req, res, next) => {
  try {
    const { title, description, category } = req.validated || req.body;

    const course = await Course.create({
      title,
      description,
      category: category || undefined,
      instructorId: req.user.userId,
    });

    const populated = await Course.findById(course._id).populate(
      'instructorId',
      'firstName lastName email'
    );

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: toCourseDto(populated, populated.instructorId),
    });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const { page, limit, sortBy, order, category } = req.validatedQuery || req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const sortField = sortBy === 'instructor' ? 'instructorId' : sortBy;
    const sort = { [sortField]: order === 'asc' ? 1 : -1 };

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('instructorId', 'firstName lastName email')
        .lean(),
      Course.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: {
        courses: courses.map((c) => toCourseDto(c, c.instructorId)),
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses: total,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
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

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: toCourseDto(course, course.instructorId),
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
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
        .json(errorResponse('FORBIDDEN', 'You can only update your own courses', 403));
    }

    const { title, description, category } = req.validated || req.body;

    if (title !== undefined) {
      course.title = title;
    }
    if (description !== undefined) {
      course.description = description;
    }
    if (category !== undefined) {
      course.category = category || undefined;
    }

    await course.save();

    const populated = await Course.findById(course._id).populate(
      'instructorId',
      'firstName lastName email'
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: toCourseDto(populated, populated.instructorId),
    });
  } catch (error) {
    next(error);
  }
};

export { create, list, get, update };
