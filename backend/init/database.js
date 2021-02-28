// Require modules
const { Database } = require('sqlite3').verbose();
const debug = require('debug')('wog:database');

/** @type {import('@wogjs/types').DatabaseManager} */
module.exports = class DatabaseManager {

  constructor({ logger, storage }) {
    this._logger = logger.scope('database');
    this._dbFile = storage.getPath('database.sqlite');
  }

  _openConnection() {
    return new Promise((resolve, reject) => {
      this._db = new Database(this._dbFile, err => {
        if (err) reject(err);
        else {
          this._logger.info('SQLite database opened.');
          this._db.on('trace', sql => {
            debug('Executing SQL: ' + sql);
          });
          resolve();
        }
      });
    });
  }

  async _exec(type, sql, ...params) {
    return new Promise((resolve, reject) => {
      this._db[type](sql, ...params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
    });
  }

  async init() {
    await this._openConnection();
  }

  //region DB Access

  async run(sql, ...params) {
    return await this._exec('run', sql, ...params);
  }

  async get(sql, ...params) {
    return await this._exec('get', sql, ...params);
  }

  async all(sql, ...params) {
    return await this._exec('all', sql, ...params);
  }

  //endregion

  dispose() {
    return new Promise((resolve, reject) => {
      this._db.close(err => {
        if (err) reject(err);
        else {
          this._logger.info('Disposed.');
          resolve();
        }
      });
    });
  }
}
