import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Update Course Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'web-development',
};

describe('PUT /api/courses/:courseId', () => {
  it('returns 200 for owner', async () => {
    const email = uniqueEmail('own');
    const reg = await request(app).post('/api/auth/register').send({
      email,
      password: 'password123',
      firstName: 'Owner',
      lastName: 'User',
      role: 'instructor',
    });
    const token = reg.body.token;
    const created = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send(validCourse);
    const id = created.body.data.courseId;

    const res = await request(app)
      .put(`/api/courses/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Title Here',
      });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated Title Here');
  });

  it('returns 403 for other instructor', async () => {
    const email1 = uniqueEmail('a');
    const email2 = uniqueEmail('b');
    const r1 = await request(app).post('/api/auth/register').send({
      email: email1,
      password: 'password123',
      firstName: 'Alpha',
      lastName: 'User',
      role: 'instructor',
    });
    const r2 = await request(app).post('/api/auth/register').send({
      email: email2,
      password: 'password123',
      firstName: 'Beta',
      lastName: 'User',
      role: 'instructor',
    });
    const created = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${r1.body.token}`)
      .send(validCourse);
    const id = created.body.data.courseId;

    const res = await request(app)
      .put(`/api/courses/${id}`)
      .set('Authorization', `Bearer ${r2.body.token}`)
      .send({ title: 'Hacked Title Here' });
    expect(res.status).toBe(403);
  });
});
