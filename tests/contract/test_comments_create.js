import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Comment Course Title Here',
  description: 'This is a long enough description for validation rules here.',
  category: 'web-development',
};

describe('POST /api/lessons/:lessonId/comments', () => {
  it('returns 201 for student', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('ci'),
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
    const lesson = await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set('Authorization', `Bearer ${inst.body.token}`)
      .send({ title: 'L', content: 'body', position: 1 });
    const lessonId = lesson.body.data.lessonId;

    const st = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('cs'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
      });

    const res = await request(app)
      .post(`/api/lessons/${lessonId}/comments`)
      .set('Authorization', `Bearer ${st.body.token}`)
      .send({ content: 'Nice lesson!' });
    expect(res.status).toBe(201);
  });

  it('returns 403 for instructor posting comment', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('ci2'),
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
    const lesson = await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set('Authorization', `Bearer ${tok}`)
      .send({ title: 'L', content: 'body', position: 1 });
    const lessonId = lesson.body.data.lessonId;

    const res = await request(app)
      .post(`/api/lessons/${lessonId}/comments`)
      .set('Authorization', `Bearer ${tok}`)
      .send({ content: 'From instructor' });
    expect(res.status).toBe(403);
  });
});
