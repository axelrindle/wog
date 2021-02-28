// Require modules
const redis = require("redis");

/** @type {import('@wogjs/types').RedisManager} */
module.exports = class RedisManager {

  constructor({ config, logger }) {
    this._logger = logger.scope('redis');
    this._config = config.secure.redis;
  }

  init() {
    this.client = redis.createClient(this._config);

    this.client.on('error', err => {
      this._logger.error(err);
    });
    this.client.on('reconnecting', (delay, attempt) => {
      this._logger.info(`Connection lost. Trying to reconnect after ${delay}ms... (Attempt ${attempt})`);
    });
    this.client.on('ready', () => {
      this._logger.info('Connected to redis server.');
    });

    return new Promise((resolve, reject) => {
      this.client.once('error', err => {
        reject(err);
      });
      this.client.once('ready', () => {
        resolve();
      });
    });
  }

  get isConnected() {
    return this.client.connected;
  }

  run(cmd, ...args) {
    this.client[cmd](...args);
  }

  dispose() {
    return new Promise((resolve, reject) => {
      this.client.quit(err => {
        if (err) reject(err);
        else {
          this._logger.info('Disposed.');
          resolve();
        }
      })
    });
  }

}
