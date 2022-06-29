const { Router } = require('express');
const KeeperService = require('../services/KeeperService');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const keeper = await KeeperService.create(req.body);
    res.json(keeper);
  } catch (error) {
    next(error);
  }
});
