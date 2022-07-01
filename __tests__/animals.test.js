const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const KeeperService = require('../lib/services/KeeperService');

const animals = [
  {
    id: '1',
    name: 'Elephants',
    image:
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
  },
  {
    id: '2',
    name: 'Tigers',
    image:
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80&auto=format&fit=crop&w=764&q=80',
  },
  {
    id: '3',
    name: 'Red Pandas',
    image:
      'https://images.unsplash.com/photo-1542880941-1abfea46bba6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVkJTIwcGFuZGF8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '4',
    name: 'Penguins',
    image:
      'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVuZ3VpbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
];
const mockKeeper = {
  name: 'Andrea',
  email: 'andrea@zoo.com',
  password: '123456',
};

const registerAndLogin = async (keeperProps = {}) => {
  const password = keeperProps.password ?? mockKeeper.password;

  const agent = request.agent(app);

  const keeper = await KeeperService.create({
    ...mockKeeper,
    ...keeperProps,
  });

  const { email } = keeper;
  await agent.post('/api/v1/keepers/sessions').send({ email, password });
  return [agent, keeper];
};

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

  it('Get /animal/:id animal detail', async () => {
    const res = await request(app).get('/api/v1/animals/3');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(animals[2]);
  });
  it('should allow keepers to create new animals', async () => {
    const newSeal = {
      name: 'Seal',
      image:
        'https://images.unsplash.com/photo-1565413294262-fa587c396965?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2VhbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    };
    const [agent] = await registerAndLogin();
    const res = await agent.post('/api/v1/animals').send(newSeal);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      name: newSeal.name,
      image: newSeal.image,
    });
  });

  afterAll(() => {
    pool.end();
  });
});
