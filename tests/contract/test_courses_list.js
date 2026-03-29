import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'List Course Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'web-development',
};

describe('GET /api/courses', () => {
  it('returns 200 with pagination', async () => {
    const email = uniqueEmail('list');
    const reg = await request(app).post('/api/auth/register').send({
      email,
      password: 'password123',
      firstName: 'List',
      lastName: 'User',
      role: 'instructor',
    });
    await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${reg.body.token}`)
      .send(validCourse);

    const res = await request(app).get('/api/courses?page=1&limit=10&sortBy=createdAt&order=desc');
    expect(res.status).toBe(200);
    expect(res.body.data.courses.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.pagination.totalCourses).toBeGreaterThanOrEqual(1);
  });
});
