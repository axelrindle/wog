// Require modules
const bcrypt = require('bcrypt');
const { idGen } = require('@wogjs/utils');

const queries = { // TODO: Move to .sql files
  createTable: `
    CREATE TABLE accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email	TEXT DEFAULT null UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    )
  `,
  insert: 'INSERT INTO accounts VALUES (NULL, ?, ?, ?, ?);',
  update: 'UPDATE accounts SET %%columns%% WHERE id = ?',
  deleteUser: 'DELETE FROM accounts WHERE id = ?',
  selectAll: 'SELECT id, username, email, role FROM accounts',
  selectFindById: 'SELECT * FROM accounts WHERE id = ?',
  selectFindByUsername: 'SELECT * FROM accounts WHERE username = ?',
  selectFindByEmail: 'SELECT * FROM accounts WHERE email = ?',
  count: 'SELECT COUNT(*) FROM accounts'
};

/** @type {import('@wogjs/types').Accounts} */
module.exports = class Accounts {

  constructor({ logger, database, storage }) {
    this._logger = logger.scope('accounts');
    this._database = database;
    this._storage = storage;
    this._needsSeed = true;
  }

  async _createTable() {
    let created = false;
    try {
      await this._database.run(queries.createTable);
      created = true;
    } catch (error) {
      if (error.message.endsWith('table accounts already exists')) {
        this._needsSeed = false;
      } else {
        throw error;
      }
    }
    if (created) {
      this._logger.info('Tables created.');
    }
  }

  async _seedDatabase() {
    if (!this._needsSeed) return;

    const rawPassword = idGen.sync(8)();
    const file = 'initialPassword.txt';
    await this._storage.writeFile(file, rawPassword);
    this._logger.info(`An initial user password has been written to storage/${file}.`);

    const hash = await this.hashPassword(rawPassword);
    const params = ['wog', 'wog@localhost', hash, 'admin'];
    await this._database.run(queries.insert, params);
    this._logger.info('Initial user account created.');
  }

  async init() {
    await this._createTable();
    await this._seedDatabase();
  }

  hashPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      })
    });
  }

  verifyPassword(password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, same) => {
        if (err) reject(err);
        else resolve(same);
      })
    });
  }

  async all() {
    return await this._database.all(queries.selectAll);
  }

  async count() {
    const row = await this._database.get(queries.count);
    return row['COUNT(*)'];
  }

  async create(user) {
    const hash = await this.hashPassword(user.password);
    const params = [user.username, user.email, hash, user.role];
    await this._database.run(queries.insert, params);
    this._logger.info(`A new user ${user.username} has been created.`);
  }

  async update(user) {
    let promise;
    if (user.password) {
      promise = this.hashPassword(user.password)
        .then(hash => {
          user.password = hash;
          return Promise.resolve(user);
        });
    }
    else {
      promise = Promise.resolve(user);
    }

    const foundUser = await promise;
    const records = [];
    const params = [];
    for (const key in foundUser) {
      if (key === 'id')
        continue;
      records.push(`${key} = ?`);
      params.push(foundUser[key]);
    }

    const query = queries.update.replace('%%columns%%', records.join(', '));
    params.push(foundUser.id);
    const result = await Promise.resolve({ query, params });
    await this._database.run(result.query, result.params);
  }

  async deleteUser(id) {
    await this._database.run(queries.deleteUser, id);
  }

  async findById(id) {
    return await this._database.get(queries.selectFindById, id);
  }

  async findByUsername(username) {
    return await this._database.get(queries.selectFindByUsername, username);
  }

  async checkAuth(username, password) {
    const user = await this.findByUsername(username);
    if (!user)
      return false;
    else {
      return this.verifyPassword(password, user.password);
    }
  }
}
