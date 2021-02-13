// Require modules
const bcrypt = require('bcrypt');
const nanoid = require('nanoid/generate');
const NANOID_ALPHABET = require('../utils/nanoid-alphabet');

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

/**
 * The Accounts class is responsible for managing user accounts.
 */
module.exports = class Accounts {

  constructor({ logger, database, storage }) {
    this.logger = logger.scope('accounts');
    this.database = database;
    this.storage = storage;
    this.needsSeed = true;
  }

  async _createTable() {
    let created = false;
    try {
      await this.database.run(queries.createTable);
      created = true;
    } catch (error) {
      if (error.message.endsWith('table accounts already exists')) {
        this.needsSeed = false;
      } else {
        throw error;
      }
    }
    if (created) {
      this.logger.info('Tables created.');
    }
  }

  async _seedDatabase() {
    if (!this.needsSeed) return;

    const rawPassword = nanoid(NANOID_ALPHABET, 8);
    const file = 'initialPassword.txt';
    await this.storage.writeFile(file, rawPassword)
    this.logger.info(`An initial user password has been written to storage/${file}.`);

    const hash = await this.hashPassword(rawPassword);
    const params = ['wog', 'wog@localhost', hash, 'admin'];
    await this.database.run(queries.insert, params);
    this.logger.info('Initial user account created.');
  }

  /**
   * Open the database connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the database connection is established.
   */
  async init() {
    await this._createTable();
    await this._seedDatabase();
  }

  /**
   * Generates a hashes password string.
   *
   * @param {string} password
   * @returns {Promise<string>} A Promise which resolves with the generated hash.
   */
  hashPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      })
    });
  }

  /**
   * Verify that a password matches a hash.
   *
   * @param {string} password The password to verify.
   * @param {string} hash The hash to verify against.
   * @returns {Promise<boolean>} A Promise that resolves with the comparison result.
   */
  verifyPassword(password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, same) => {
        if (err) reject(err);
        else resolve(same);
      })
    });
  }

  /**
   * Queries a list of all users.
   *
   * @returns {Promise<Array>} A Promise that resolves with the result rows.
   */
  async all() {
    return await this.database.all(queries.selectAll);
  }

  /**
   * Count the total number of users.
   *
   * @returns {Promise<Number>} A Promise that resolves with the amount of user accounts.
   */
  async count() {
    const row = await this.database.get(queries.count);
    return row['COUNT(*)'];
  }

  /**
   * Insert a new user account into the database.
   *
   * @param {Object} user The user to insert.
   * @returns {Promise<Void>} A Promise that resolves when the user has been created.
   */
  async create(user) {
    const hash = await this.hashPassword(user.password);
    const params = [user.username, user.email, hash, user.role];
    await this.database.run(queries.insert, params);
    this.logger.info(`A new user ${user.username} has been created.`);
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
    await this.database.run(result.query, result.params);
  }

  /**
   * Delete a user.
   *
   * @param {Number} id
   * @returns {Promise<Void>} A Promise that resolves when the user has been deleted.
   */
  async deleteUser(id) {
    await this.database.run(queries.deleteUser, id);
  }

  /**
   * Queries a specific user identified by the id.
   *
   * @param {string} id
   * @returns {Promise} A Promise which resolves with the result row.
   */
  async findById(id) {
    return await this.database.get(queries.selectFindById, id);
  }

  /**
   * Queries a specific user identified by the username.
   *
   * @param {string} username
   * @returns {Promise} A Promise which resolves with the result row.
   */
  async findByUsername(username) {
    return await this.database.get(queries.selectFindByUsername, username);
  }

  /**
   * Check whether a given username/password combination is correct.
   *
   * @param {string} username
   * @param {string} password
   * @returns {Promise<boolean>} A Promise which resolves with the result.
   */
  async checkAuth(username, password) {
    const user = await this.findByUsername(username);
    if (!user)
      return false;
    else {
      return this.verifyPassword(password, user.password);
    }
  }
}
