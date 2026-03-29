import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Comments Flow Course Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'web-development',
};

describe('Comments flow', () => {
  it('student comments → list newest first', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('zfi'),
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
      .send({ title: 'L', content: 'c', position: 1 });
    const lessonId = lesson.body.data.lessonId;

    const st = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('zfs'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
      });
    const tok = st.body.token;

    await request(app)
      .post(`/api/lessons/${lessonId}/comments`)
      .set('Authorization', `Bearer ${tok}`)
      .send({ content: 'Older' });
    await request(app)
      .post(`/api/lessons/${lessonId}/comments`)
      .set('Authorization', `Bearer ${tok}`)
      .send({ content: 'Newer' });

    const res = await request(app).get(`/api/lessons/${lessonId}/comments`);
    expect(res.body.data.comments[0].content).toBe('Newer');
  });
});
