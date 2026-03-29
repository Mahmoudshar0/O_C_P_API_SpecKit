import request from 'supertest';
import app from '../../src/app.js';

describe('Auth flow integration', () => {
  it('register → login → refresh', async () => {
    const email = 'flow@test.com';
    const password = 'password123';

    const reg = await request(app).post('/api/auth/register').send({
      email,
      password,
      firstName: 'Flow',
      lastName: 'User',
      role: 'student',
    });
    expect(reg.status).toBe(201);

    const login = await request(app).post('/api/auth/login').send({ email, password });
    expect(login.status).toBe(200);
    const token2 = login.body.token;

    const refresh = await request(app)
      .post('/api/auth/refresh')
      .set('Authorization', `Bearer ${token2}`)
      .send({});
    expect(refresh.status).toBe(200);
    expect(refresh.body.token).toBeDefined();
    expect(typeof refresh.body.token).toBe('string');
  });
});
