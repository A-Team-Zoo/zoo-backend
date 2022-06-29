const pool = require('../utils/pool');

module.exports = class Animal {
  id;
  name;
  image;
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.image = row.image;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT id, name FROM animals');
    return rows.map((row) => new Animal(row));
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM animals WHERE id=$1', [
      id,
    ]);
    if (!rows) return null;
    return new Animal(rows[0]);
  }
};
