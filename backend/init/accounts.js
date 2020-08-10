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
class Accounts {

  constructor() {
    this.logger = logger.scope('accounts');
    this.dbFile = storage.getPath('accounts.sqlite');
    this.needsSeed = true;
  }

  _openConnection() {
    return new Promise((resolve, reject) => {
      this.db = new Database(this.dbFile, err => {
        if (err) reject(err);
        else {
          this.logger.info('SQLite database opened.');
          this.db.on('trace', sql => {
            this.logger.debug('Executing SQL: ' + sql);
          });
          resolve();
        }
      });
    });
  }

  _createTable() {
    return new Promise((resolve, reject) => {
      this.db.run(queries.createTable, err => {
        if (err) {
          if (err.message.endsWith('table accounts already exists')) {
            this.needsSeed = false;
            resolve();
          } else {
            reject(err);
          }
        }
        else {
          this.logger.info('Tables created.');
          resolve();
        }
      })
    });
  }

  async _seedDatabase() {
    if (!this.needsSeed) return;

    const rawPassword = nanoid(NANOID_ALPHABET, 8);
    const file = 'initialPassword.txt';
    await storage.writeFile(file, rawPassword)
    this.logger.info(`An initial user password has been written to storage/${file}.`);

    const hash = await this.hashPassword(rawPassword);
    return new Promise((resolve, reject) => {
      const params = ['wog', 'wog@localhost', hash, 'admin'];
      this.db.run(queries.insert, params, err => {
        if (err) reject(err);
        else {
          this.logger.info('Initial user account created.');
          resolve();
        }
      });
    })
  }

  /**
   * Open the database connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the database connection is established.
   */
  async init() {
    await this._openConnection();
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
  all() {
    return new Promise((resolve, reject) => {
      this.db.all(queries.selectAll, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Count the total number of users.
   *
   * @returns {Promise<Array>} A Promise that resolves with the result row.
   */
  count() {
    return new Promise((resolve, reject) => {
      this.db.get(queries.count, (err, row) => {
        if (err) reject(err);
        else resolve(row['COUNT(*)']);
      });
    });
  }

  /**
   * Insert a new user account into the database.
   *
   * @param {Object} user The user to insert.
   * @returns {Promise<Void>} A Promise that resolves when the user has been created.
   */
  async create(user) {
    const hash = await this.hashPassword(user.password);
    return new Promise((resolve, reject) => {
      const params = [user.username, user.email, hash, user.role];
      this.db.run(queries.insert, params, err => {
        if (err) {
          this.logger.error(err);
          reject(err);
        }
        else {
          this.logger.info(`A new user ${user.username} has been created.`);
          resolve();
        }
      });
    });
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

    return new Promise((resolve, reject) => {
      this.db.run(result.query, result.params, err => {
        if (err)
          reject(err);
        else
          resolve();
      });
    });
  }

  /**
   * Delete a user.
   *
   * @param {Number} id
   * @returns {Promise<Void>} A Promise that resolves when the user has been deleted.
   */
  deleteUser(id) {
    return new Promise((resolve, reject) => {
      this.db.run(queries.deleteUser, id, err => {
        if (err) reject(err);
        else resolve();
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
  async checkAuth(username, password) {
    const user = await this.findByUsername(username);
    if (!user)
      return false;
    else {
      return this.verifyPassword(password, user.password);
    }
  }

  /**
   * Closes the database connection.
   */
  dispose() {
    return new Promise((resolve, reject) => {
      this.db.close(err => {
        if (err) reject(err);
        else {
          this.logger.info('Disposed.');
          resolve();
        }
      });
    });
  }

}

module.exports = new Accounts();
