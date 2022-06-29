const { Router } = require('express');
const Animal = require('../models/Animal');

module.exports = Router()
  .get('/:id', async (req, res, next) => {
    try {
      const animal = await Animal.getById(req.params.id);
      res.json(animal);
    } catch (e) {
      next(e);
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const animals = await Animal.getAll();
      res.json(animals);
    } catch (e) {
      next(e);
    }
  });
