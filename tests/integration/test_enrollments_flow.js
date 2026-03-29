import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Enrollment Flow Course Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'data-science',
};

describe('Enrollments flow', () => {
  it('student enrolls → lists my-courses → unenrolls', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('efi'),
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
        email: uniqueEmail('efs'),
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

    const my = await request(app)
      .get('/api/enrollments/my-courses')
      .set('Authorization', `Bearer ${tok}`);
    expect(my.body.data.enrollments.length).toBe(1);

    const del = await request(app)
      .delete(`/api/enrollments/${eid}`)
      .set('Authorization', `Bearer ${tok}`);
    expect(del.status).toBe(200);

    const my2 = await request(app)
      .get('/api/enrollments/my-courses')
      .set('Authorization', `Bearer ${tok}`);
    expect(my2.body.data.enrollments.length).toBe(0);
  });
});
