const { Router } = require('express');
const Animal = require('../models/Animal');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const animals = await Animal.getAll();
    res.json(animals);
  } catch (err) {
    next(err);
  }
});
