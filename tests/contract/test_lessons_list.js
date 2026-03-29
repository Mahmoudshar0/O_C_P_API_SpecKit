import request from 'supertest';
import app from '../../src/app.js';
import { uniqueEmail } from '../helpers.js';

const validCourse = {
  title: 'Lesson List Course Title',
  description: 'This is a long enough description for validation rules here.',
  category: 'data-science',
};

describe('GET /api/courses/:courseId/lessons', () => {
  it('returns 200 with lessons sorted by position', async () => {
    const inst = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail('lli'),
        password: 'password123',
        firstName: 'Instr',
        lastName: 'Uctor',
        role: 'instructor',
      });
    const tok = inst.body.token;
    const course = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${tok}`)
      .send(validCourse);
    const courseId = course.body.data.courseId;

    await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set('Authorization', `Bearer ${tok}`)
      .send({ title: 'L2', content: 'c', position: 2 });
    await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set('Authorization', `Bearer ${tok}`)
      .send({ title: 'L1', content: 'c', position: 1 });

    const res = await request(app).get(`/api/courses/${courseId}/lessons`);
    expect(res.status).toBe(200);
    expect(res.body.data.lessons.map((l) => l.position)).toEqual([1, 2]);
  });
});
