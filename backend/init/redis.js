// Require modules
const redis = require("redis");

class RedisManager {

  init() {
    this.logger = logger.scope('redis');
    this.client = redis.createClient(config.secure.redis);

    this.client.on('error', err => {
      this.logger.error(err);
    });
    this.client.on('reconnecting', (delay, attempt) => {
      this.logger.info(`Connection lost. Trying to reconnect after ${delay}ms... (Attempt ${attempt})`);
    });
    this.client.on('ready', () => {
      this.logger.info('Connected to redis server.');
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

  /**
   * Indicates whether a connection is currently established.
   */
  get isConnected() {
    return this.client.connected;
  }

  /**
   * Executes the given redis command on the current connection.
   *
   * @param {string} cmd The command to execute.
   * @param  {...any} args An arguments to pass to the command. The last argument must be the callback.
   */
  run(cmd, ...args) {
    this.client[cmd](...args);
  }

  dispose() {
    return new Promise((resolve, reject) => {
      this.client.quit(err => {
        if (err) reject(err);
        else {
          this.logger.info('Disposed.');
          resolve();
        }
      })
    });
  }

}

module.exports = new RedisManager();
