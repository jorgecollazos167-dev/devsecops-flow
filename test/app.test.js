const request = require('supertest');
const app = require('../src/app');
describe('DevSecOps Demo', () => {
  test('GET / returns 200', async () => expect((await request(app).get('/')).statusCode).toBe(200));
  test('GET /health returns UP', async () => {
    const r = await request(app).get('/health');
    expect(r.statusCode).toBe(200);
    expect(r.body.status).toBe('UP');
  });
  test('GET /api/users returns array', async () => {
    const r = await request(app).get('/api/users');
    expect(Array.isArray(r.body)).toBe(true);
  });

test('GET /api/info returns application information', async () => {
  const response = await request(app).get('/api/info');

  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe('DevSecOps Demo');
  expect(response.body.version).toBeDefined();
  expect(response.body.environment).toBeDefined();
});



});
