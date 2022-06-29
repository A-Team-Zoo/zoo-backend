const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockKeeper = {
  name: 'Andrea',
  email: 'andrea@zoo.com',
  password: '123456',
};

const mockPretender = {
  name: 'Andria',
  email: 'andria@notzoo.com',
  password: '654321',
};

describe('keepers auth tests', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should create a new user', async () => {
    const res = await request(app).post('/api/v1/keepers').send(mockKeeper);
    const { email, name } = mockKeeper;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
      name,
    });
  });

  it('should reject someone who does not have @zoo.com email', async () => {
    const res = await request(app).post('/api/v1/keepers').send(mockPretender);
    expect(res.status).toBe(500);
    expect(res.body.message).toEqual('REJECTED!!! You are not a Keeper');
  });

  afterAll(() => {
    pool.end();
  });
});
