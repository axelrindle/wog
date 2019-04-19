// Require modules
const { promisify } = require('util');
const redis = require('redis');
const prettyBytes = require('pretty-bytes');
const BaseAdapter = require('./BaseAdapter');

/**
 * The RedisAdapter reads lists in redis databases.
 *
 * @extends BaseAdapter
 */
class RedisAdapter extends BaseAdapter {
  init() {
    this.logger.await('Establishing redis connection...');

    const self = this;
    return new Promise((resolve, reject) => {
      self.client = redis.createClient(self.options.connection);
      self.client.on("error", reject);
      self.client.on('ready', () => {
        self.logger.complete('Connected to redis.');
        self.loadEntries();
        resolve();
      });
    });
  }

  loadEntries() {
    // promisify required redis commands
    this.selectAsync = promisify(this.client.select).bind(this.client);
    this.typeAsync = promisify(this.client.type).bind(this.client);
    this.llenAsync = promisify(this.client.llen).bind(this.client);
    this.lrangeAsync = promisify(this.client.lrange).bind(this.client);

    // save entries
    this._entries = this.options.keys.split('|')
      .map(el => {
        const split = el.split(':');
        return {
          id: this.generateId(),
          db: parseInt(split[0]),
          name: split[1],
          path: `redis:${split[0]}/${split[1]}`
        };
      });
    this.logger.info(`Loaded ${this.entries.length} keys.`);
  }

  dispose() {
    this.client.quit();
  }

  supportsEvents() {
    return false;
  }

  get entries() {
    return this._entries;
  }

  getEntry(id) {
    return this.entries.find(el => el.id === id);
  }

  getContents(id) {
    const entry = this.getEntry(id);
    const result = {};
    return new Promise((resolve, reject) => {
      if (!entry) reject(`No entry found with id ${id}!`);
      resolve(this.selectAsync(entry.db));
    })
      .then(() => this.llenAsync(entry.name))
      .then(length => this.lrangeAsync(entry.name, 0, length - 1))
      .then(rows => {
        result.lines = rows;
        result.size = prettyBytes(Buffer.byteLength(rows.toString(), 'utf-8'))
        return result;
      });
  }

  download(res, id) {
    // TODO: Download a redis key into a file
  }
}

module.exports = RedisAdapter;
