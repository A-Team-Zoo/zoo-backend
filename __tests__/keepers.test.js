const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockKeeper = {
  email: 'andrea@zoo.com',
  password: '123456',
};

describe('keepers auth tests', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should create a new user', async () => {
    const res = await request(app).post('/api/v1/keepers').send(mockKeeper);
    const { email } = mockKeeper;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  afterAll(() => {
    pool.end();
  });
});
