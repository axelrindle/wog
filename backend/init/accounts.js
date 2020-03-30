// Require modules
const bcrypt = require('bcrypt');
const nanoid = require('nanoid/generate');
const { NANOID_ALPHABET } = require('../util');
const { Database } = (() => {
  const sqlite3 = require('sqlite3');
  return DEBUG ? sqlite3.verbose() : sqlite3;
})();

const queries = {
  createTable: `
    CREATE TABLE accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    )
  `,
  seed: 'INSERT INTO accounts VALUES (NULL, ?, ?, ?);',
  selectAll: 'SELECT id, username, role FROM accounts',
  selectFindById: 'SELECT * FROM accounts WHERE id = ?',
  selectFindByUsername: 'SELECT * FROM accounts WHERE username = ?'
};

/**
 * The Accounts class is responsible for managing user accounts.
 */
class Accounts {

  constructor() {
    this.logger = logger.scope('accounts');
    this.dbFile = storage.getPath('accounts.sqlite');
  }

  _openConnection() {
    return new Promise((resolve, reject) => {
      this.db = new Database(this.dbFile, err => {
        if (err) reject(err);
        else {
          this.logger.info('SQLite database opened.');
          resolve(this._createTable());
        }
      });
    });
  }

  _createTable() {
    return new Promise((resolve, reject) => {
      this.db.run(queries.createTable, err => {
        if (err) {
          if (err.message.endsWith('table accounts already exists')) {
            resolve();
          } else {
            reject(err);
          }
        }
        else {
          this.logger.info('Tables created.');
          resolve(this._seedDatabase());
        }
      })
    });
  }

  _seedDatabase() {
    const rawPassword = nanoid(NANOID_ALPHABET, 8);
    const file = 'initialPassword.txt';
    return storage.writeFile(file, rawPassword)
      .then(() => {
        this.logger.info(`An initial user password has been written to storage/${file}.`);
        return this.hashPassword(rawPassword);
      })
      .then(hash => new Promise((resolve, reject) => {
        const params = ['wog', hash, 'admin'];
        this.db.run(queries.seed, params, err => {
          if (err) reject(err);
          else {
            this.logger.info('Initial user account created.');
            resolve();
          }
        });
      }));
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
   * Open the database connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the database connection is established.
   */
  init() {
    return this._openConnection();
  }

  /**
   * Queries a list of all users.
   *
   * @returns {Promise<Array>} A Promise that resolves with the result rows.
   */
  all() {
    return new Promise((resolve, reject) => {
      this.db.all(queries.selectAll, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Queries a specific user identified by the id.
   *
   * @param {string} id
   * @returns {Promise} A Promise which resolves with the result row.
   */
  findById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.selectFindById, id, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      })
    });
  }

  /**
   * Queries a specific user identified by the username.
   *
   * @param {string} username
   * @returns {Promise} A Promise which resolves with the result row.
   */
  findByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.get(queries.selectFindByUsername, username, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      })
    });
  }

  /**
   * Check whether a given username/password combination is correct.
   *
   * @param {string} username
   * @param {string} password
   * @returns {Promise<boolean>} A Promise which resolves with the result.
   */
  checkAuth(username, password) {
    return this.findByUsername(username)
      .then(user => {
        if (!user) return false;
        else {
          return this.verifyPassword(password, user.password);
        }
      });
  }

}

module.exports = new Accounts();
