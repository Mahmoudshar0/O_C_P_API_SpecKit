import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Get Course Title X',
  description: 'This is a long enough description for validation rules here.',
  category: 'web-development',
};

describe('GET /api/courses/:courseId', () => {
  it('returns 200 for existing course', async () => {
    const email = uniqueEmail('get');
    const reg = await request(app).post('/api/auth/register').send({
      email,
      password: 'password123',
      firstName: 'Get',
      lastName: 'User',
      role: 'instructor',
    });
    const created = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${reg.body.token}`)
      .send(validCourse);
    const id = created.body.data.courseId;

    const res = await request(app).get(`/api/courses/${id}`);
    expect(res.status).toBe(200);
    expect(String(res.body.data.courseId)).toBe(String(id));
  });

  it('returns 404 for unknown id', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/courses/${id}`);
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid id', async () => {
    const res = await request(app).get('/api/courses/not-an-id');
    expect(res.status).toBe(400);
  });
});
