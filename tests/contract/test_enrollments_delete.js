import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Delete Enroll Course Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'web-development',
};

describe('DELETE /api/enrollments/:enrollmentId', () => {
  it('returns 200 when unenrolling own enrollment', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('di'),
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
        email: uniqueEmail('ds'),
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
      .delete(`/api/enrollments/${eid}`)
      .set('Authorization', `Bearer ${tok}`);
    expect(res.status).toBe(200);
  });

  it('returns 403 when deleting other user enrollment', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('di2'),
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
        email: uniqueEmail('ds1'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'One',
        role: 'student',
      });
    const st2 = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('ds2'),
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
      .delete(`/api/enrollments/${eid}`)
      .set('Authorization', `Bearer ${st2.body.token}`);
    expect(res.status).toBe(403);
  });
});
