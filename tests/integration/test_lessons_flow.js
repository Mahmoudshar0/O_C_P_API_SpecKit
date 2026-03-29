import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Lessons Flow Course Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'web-development',
};

describe('Lessons flow', () => {
  it('instructor creates course → adds lessons → student lists lessons ordered', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('lfi'),
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

    await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set('Authorization', `Bearer ${tok}`)
      .send({ title: 'A', content: 'a', position: 1 });
    await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set('Authorization', `Bearer ${tok}`)
      .send({ title: 'B', content: 'b', position: 2 });

    await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('lfs'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
      });

    const res = await request(app).get(`/api/courses/${courseId}/lessons`);
    expect(res.status).toBe(200);
    expect(res.body.data.lessons.map((l) => l.title)).toEqual(['A', 'B']);
  });
});
