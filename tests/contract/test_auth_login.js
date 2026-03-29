import request from 'supertest';
import app from '../../src/app.js';

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      email: 'login@test.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('returns 200 with token for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });

  it('returns 401 for unknown email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(401);
  });

  it('returns 422 when email invalid', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'bad',
      password: 'password123',
    });
    expect(res.status).toBe(422);
  });
});
