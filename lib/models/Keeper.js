const pool = require('../utils/pool');

module.exports = class Keeper {
  id;
  name;
  email;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ email, passwordHash, name }) {
    const { rows } = await pool.query(
      `
      INSERT INTO keepers (email, password_hash, name) VALUES ($1, $2, $3)
      RETURNING *
    `,
      [email, passwordHash, name]
    );
    return new Keeper(rows[0]);
  }
  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT * 
      FROM keepers 
      WHERE email=$1
      `,
      [email]
    );
    if (!rows[0]) return null;

    return new Keeper(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
