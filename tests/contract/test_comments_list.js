import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Comment List Course Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'mobile-dev',
};

describe('GET /api/lessons/:lessonId/comments', () => {
  it('returns 200 with comments newest first', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('cli'),
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

    const s1 = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('c1'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'One',
        role: 'student',
      });
    const s2 = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('c2'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'Two',
        role: 'student',
      });

    await request(app)
      .post(`/api/lessons/${lessonId}/comments`)
      .set('Authorization', `Bearer ${s1.body.token}`)
      .send({ content: 'First comment' });
    await request(app)
      .post(`/api/lessons/${lessonId}/comments`)
      .set('Authorization', `Bearer ${s2.body.token}`)
      .send({ content: 'Second comment' });

    const res = await request(app).get(`/api/lessons/${lessonId}/comments?page=1&limit=10`);
    expect(res.status).toBe(200);
    expect(res.body.data.comments[0].content).toBe('Second comment');
    expect(res.body.data.comments[1].content).toBe('First comment');
  });
});
