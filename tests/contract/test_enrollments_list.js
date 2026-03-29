import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'My Courses List Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'mobile-dev',
};

describe('GET /api/enrollments/my-courses', () => {
  it('returns 200 with student enrollments', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('mi'),
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
        email: uniqueEmail('ms'),
        password: 'password123',
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
      });
    const tok = st.body.token;
    await request(app).post('/api/enrollments').set('Authorization', `Bearer ${tok}`).send({
      courseId,
    });

    const res = await request(app)
      .get('/api/enrollments/my-courses?page=1&limit=10')
      .set('Authorization', `Bearer ${tok}`);
    expect(res.status).toBe(200);
    expect(res.body.data.enrollments.length).toBe(1);
  });
});
