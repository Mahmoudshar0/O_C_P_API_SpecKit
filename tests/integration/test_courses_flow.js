import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Integration Course Flow Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'web-development',
};

describe('Courses flow', () => {
  it('instructor creates course → student lists → student views detail', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('cfi'),
        password: 'password123',
        firstName: 'Instr',
        lastName: 'Uctor',
        role: 'instructor',
      });
    const created = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${inst.body.token}`)
      .send(validCourse);
    expect(created.status).toBe(201);
    const id = created.body.data.courseId;

    await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('cfs'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
      });

    const list = await request(app).get('/api/courses');
    expect(list.status).toBe(200);
    expect(list.body.data.courses.some((c) => String(c.courseId) === String(id))).toBe(true);

    const detail = await request(app).get(`/api/courses/${id}`);
    expect(detail.status).toBe(200);
    expect(detail.body.data.title).toBe(validCourse.title);
  });
});
