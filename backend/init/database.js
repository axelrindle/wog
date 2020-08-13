// Require modules
const { Database } = (() => {
  const sqlite3 = require('sqlite3');
  return DEBUG ? sqlite3.verbose() : sqlite3;
})();

class DatabaseManager {

  constructor() {
    this.logger = logger.scope('database');
    this.dbFile = storage.getPath('database.sqlite');
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

  async _exec(type, sql, ...params) {
    return new Promise((resolve, reject) => {
      this.db[type](sql, ...params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
    });
  }

  /**
   * Open the database connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the database connection is established.
   */
  async init() {
    await this._openConnection();
  }

  //region DB Access

  /**
   * Runs the SQL query with the specified parameters and calls the callback afterwards. It does not retrieve any result data.
   *
   * @param {string} sql The SQL query to run. If the SQL query is invalid and a callback was passed to the function,
   *                     it is called with an error object containing the error message from SQLite. If no callback was
   *                     passed and preparing fails, an error event will be emitted on the underlying Statement object.
   * @param  {...any} params When the SQL statement contains placeholders, you can pass them in here.
   *                         They will be bound to the statement before it is executed.
   * @returns {Promise<void>} A Promise that resolves when the query was executed.
   */
  async run(sql, ...params) {
    return await this._exec('run', sql, ...params);
  }

  /**
   * Runs the SQL query with the specified parameters and calls the callback afterwards. It does not retrieve any result data.
   *
   * @param {string} sql The SQL query to run. If the SQL query is invalid and a callback was passed to the function,
   *                     it is called with an error object containing the error message from SQLite. If no callback was
   *                     passed and preparing fails, an error event will be emitted on the underlying Statement object.
   * @param  {...any} params When the SQL statement contains placeholders, you can pass them in here.
   *                         They will be bound to the statement before it is executed.
   * @returns {Promise<Object?>} A Promise that resolves with the first result row.
   */
  async get(sql, ...params) {
    return await this._exec('get', sql, ...params);
  }

  /**
   * Runs the SQL query with the specified parameters and calls the callback afterwards. It does not retrieve any result data.
   *
   * @param {string} sql The SQL query to run. If the SQL query is invalid and a callback was passed to the function,
   *                     it is called with an error object containing the error message from SQLite. If no callback was
   *                     passed and preparing fails, an error event will be emitted on the underlying Statement object.
   * @param  {...any} params When the SQL statement contains placeholders, you can pass them in here.
   *                         They will be bound to the statement before it is executed.
   * @returns {Promise<Array<Object>>} A Promise that resolves with all result rows.
   */
  async all(sql, ...params) {
    return await this._exec('all', sql, ...params);
  }

  //endregion

  /**
   * Closes the database connection.
   *
   * @returns {Promise<void>} A Promise that resolves after the database connection has been closed.
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

module.exports = new DatabaseManager();
