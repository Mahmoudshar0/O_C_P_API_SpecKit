import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Intro to Testing',
  description: 'This is a long enough description for validation rules.',
  category: 'web-development',
};

async function registerAndToken(role) {
  const email = uniqueEmail('c');
  const res = await request(app).post('/api/auth/register').send({
    email,
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role,
  });
  return { token: res.body.token, email };
}

describe('POST /api/courses', () => {
  it('returns 201 for instructor', async () => {
    const { token } = await registerAndToken('instructor');
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send(validCourse);
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe(validCourse.title);
  });

  it('returns 403 for student', async () => {
    const { token } = await registerAndToken('student');
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send(validCourse);
    expect(res.status).toBe(403);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/courses').send(validCourse);
    expect(res.status).toBe(401);
  });

  it('returns 422 for invalid body', async () => {
    const { token } = await registerAndToken('instructor');
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'ab', description: 'short' });
    expect(res.status).toBe(422);
  });
});
