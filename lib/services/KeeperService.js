const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Keeper = require('../models/Keeper');

module.exports = class KeeperService {
  static async create({ email, password, name }) {
    if (email.length <= 6) {
      throw new Error('Invalid email');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (!email.includes('@zoo.com')) {
      throw new Error('REJECTED!!! You are not a Keeper');
    }

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const keeper = await Keeper.insert({
      email,
      passwordHash,
      name,
    });

    return keeper;
  }

  static async signIn({ email, password = '' }) {
    try {
      const keeper = await Keeper.getByEmail(email);

      if (!keeper) throw new Error('Invalid Email or Password');
      if (!bcrypt.compareSync(password, keeper.passwordHash))
        throw new Error('Invalid Email or Password');

      const token = jwt.sign({ ...keeper }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      return token;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
