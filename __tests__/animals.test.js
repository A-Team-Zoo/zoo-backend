const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const animals = [
  {
    name: 'Elephants',
    image:
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
  },
  {
    name: 'Tigers',
    image:
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80&auto=format&fit=crop&w=764&q=80',
  },
  {
    name: 'Red Pandas',
    image:
      'https://images.unsplash.com/photo-1542880941-1abfea46bba6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVkJTIwcGFuZGF8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
  },
  {
    name: 'Penguins',
    image:
      'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVuZ3VpbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
];

describe('backend animal routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('GET /animals displays animals', async () => {
    const res = await request(app).get('/api/v1/animals');
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(4);
    expect(res.body[0].name).toEqual('Elephants');
  });
  afterAll(() => {
    pool.end();
  });
});
