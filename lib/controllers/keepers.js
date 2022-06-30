const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const KeeperService = require('../services/KeeperService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const keeper = await KeeperService.create(req.body);
      res.json(keeper);
    } catch (error) {
      next(error);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const sessionToken = await KeeperService.signIn({ email, password });

      res
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          httpOnly: true,
          sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'false',
          secure: process.env.SECURE_COOKIES === 'true',
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in successfully' });
    } catch (e) {
      next(e);
    }
  })
  .get('/me', authenticate, (req, res) => {
    res.json(req.keeper);
  })

  .delete('/sessions', authenticate, (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'false',
        secure: process.env.SECURE_COOKIES === 'true',
        maxAge: ONE_DAY_IN_MS,
      })
      .status(204)
      .send();
  });
