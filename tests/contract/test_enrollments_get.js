import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Get Enroll Course Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'web-development',
};

describe('GET /api/enrollments/:enrollmentId', () => {
  it('returns 200 for own enrollment', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('ei'),
        password: 'password123',
        firstName: 'Instr',
        lastName: 'Uctor',
        role: 'instructor',
      });
    const course = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${inst.body.token}`)
      .send(validCourse);
    const courseId = course.body.data.courseId;

    const st = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('es'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
      });
    const tok = st.body.token;
    const en = await request(app)
      .post('/api/enrollments')
      .set('Authorization', `Bearer ${tok}`)
      .send({ courseId });
    const eid = en.body.data.enrollmentId;

    const res = await request(app)
      .get(`/api/enrollments/${eid}`)
      .set('Authorization', `Bearer ${tok}`);
    expect(res.status).toBe(200);
    expect(String(res.body.data.enrollmentId)).toBe(String(eid));
  });

  it('returns 403 for other user enrollment', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('ei2'),
        password: 'password123',
        firstName: 'Instr',
        lastName: 'Uctor',
        role: 'instructor',
      });
    const course = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${inst.body.token}`)
      .send(validCourse);
    const courseId = course.body.data.courseId;

    const st1 = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('es1'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'One',
        role: 'student',
      });
    const st2 = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('es2'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'Two',
        role: 'student',
      });
    const en = await request(app)
      .post('/api/enrollments')
      .set('Authorization', `Bearer ${st1.body.token}`)
      .send({ courseId });
    const eid = en.body.data.enrollmentId;

    const res = await request(app)
      .get(`/api/enrollments/${eid}`)
      .set('Authorization', `Bearer ${st2.body.token}`);
    expect(res.status).toBe(403);
  });
});
