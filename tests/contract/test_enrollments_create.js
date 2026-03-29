import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Enrollment Course Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'data-science',
};

describe('POST /api/enrollments', () => {
  it('returns 201 when enrolling in course', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('inst'),
        password: 'password123',
        firstName: 'Instr',
        lastName: 'Uctor',
        role: 'instructor',
      });
    const course = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${inst.body.token}`)
      .send(validCourse);
    const courseId = course.body.data.courseId;

    const st = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('stu'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
      });

    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', `Bearer ${st.body.token}`)
      .send({ courseId });

    expect(res.status).toBe(201);
    expect(String(res.body.data.courseId)).toBe(String(courseId));
  });

  it('returns 409 when already enrolled', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('inst2'),
        password: 'password123',
        firstName: 'Instr',
        lastName: 'Uctor',
        role: 'instructor',
      });
    const course = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${inst.body.token}`)
      .send(validCourse);
    const courseId = course.body.data.courseId;

    const st = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('stu2'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
      });
    const tok = st.body.token;
    await request(app).post('/api/enrollments').set('Authorization', `Bearer ${tok}`).send({
      courseId,
    });
    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', `Bearer ${tok}`)
      .send({
        courseId,
      });
    expect(res.status).toBe(409);
  });

  it('returns 404 for missing course', async () => {
    const st = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('stu3'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
      });
    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', `Bearer ${st.body.token}`)
      .send({ courseId: new mongoose.Types.ObjectId().toString() });
    expect(res.status).toBe(404);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).post('/api/enrollments').send({
      courseId: new mongoose.Types.ObjectId().toString(),
    });
    expect(res.status).toBe(401);
  });
});
