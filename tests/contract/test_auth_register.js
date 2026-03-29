import request from 'supertest';
import app from '../../src/app.js';

describe('POST /api/auth/register', () => {
  it('returns 201 with token for valid input', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'user1@test.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'student',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data.email).toBe('user1@test.com');
  });

  it('returns 422 for invalid input', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'invalid-email',
      password: 'short',
      firstName: 'J',
      lastName: 'Doe',
    });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('returns 409 when email already exists', async () => {
    const body = {
      email: 'dup@test.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };
    await request(app).post('/api/auth/register').send(body);
    const res = await request(app).post('/api/auth/register').send(body);
    expect(res.status).toBe(409);
  });
});
