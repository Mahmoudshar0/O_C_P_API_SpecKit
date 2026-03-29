import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Lesson Course Title Here',
  description: 'This is a long enough description for validation rules here.',
  category: 'web-development',
};

describe('POST /api/courses/:courseId/lessons', () => {
  it('returns 201 for course owner', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('li'),
        password: 'password123',
        firstName: 'Instr',
        lastName: 'Uctor',
        role: 'instructor',
      });
    const tok = inst.body.token;
    const course = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${tok}`)
      .send(validCourse);
    const courseId = course.body.data.courseId;

    const res = await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set('Authorization', `Bearer ${tok}`)
      .send({
        title: 'Lesson One',
        content: 'Lesson body content here.',
        position: 1,
      });
    expect(res.status).toBe(201);
  });

  it('returns 403 for other instructor', async () => {
    const inst1 = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('l1'),
        password: 'password123',
        firstName: 'Alpha',
        lastName: 'User',
        role: 'instructor',
      });
    const inst2 = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('l2'),
        password: 'password123',
        firstName: 'Beta',
        lastName: 'User',
        role: 'instructor',
      });
    const course = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${inst1.body.token}`)
      .send(validCourse);
    const courseId = course.body.data.courseId;

    const res = await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set('Authorization', `Bearer ${inst2.body.token}`)
      .send({
        title: 'Lesson One',
        content: 'Lesson body content here.',
        position: 1,
      });
    expect(res.status).toBe(403);
  });

  it('returns 401 without auth', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('l3'),
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

    const res = await request(app).post(`/api/courses/${courseId}/lessons`).send({
      title: 'Lesson One',
      content: 'Lesson body content here.',
      position: 1,
    });
    expect(res.status).toBe(401);
  });
});
