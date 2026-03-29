import request from 'supertest';
import app from '../../src/app.js';

describe('POST /api/auth/refresh', () => {
  it('returns 200 with new token when Authorization valid', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      email: 'refresh@test.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });
    const token = reg.body.token;

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/auth/refresh').send({});
    expect(res.status).toBe(401);
  });

  it('returns 401 for invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Authorization', 'Bearer invalid.token.here')
      .send({});
    expect(res.status).toBe(401);
  });
});
