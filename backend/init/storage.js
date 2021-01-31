// Require modules
const fs = require('fs').promises;
const path = require('path');
const debug = require('debug')('wog:storage');
const prettyBytes = require('pretty-bytes');

/**
 * The Storage class is a small utility for working with files within the `storage/` directory.
 */
module.exports = class Storage {

  constructor() {
    this.root = path.join(ROOT_DIRECTORY, 'storage');
  }

  /**
   * Build the absolute path to a directory or file in the storage.
   *
   * @param {string} name The relative path.
   * @returns {string} The absolute path.
   */
  getPath(name = "") {
    return path.join(this.root, name);
  }

  /**
   * Create a new storage directory.
   *
   * @param {string} name The directory name.
   * @returns {Promise} A promise.
   */
  async createDirectory(name) {
    const path = this.getPath(name);
    await fs.mkdir(path, {
      recursive: true // like 'mkdir -p'
    });
    debug('Init storage directory%s', name ? ` ${name}` : "");
    return path;
  }

  /**
   * Writes content to a file. The file is created if it does not exist.
   * Note that existing files are overwritten.
   *
   * @param {string} name The file name.
   * @param {string} content The content. Defaults to nothing.
   * @returns {Promise} A promise.
   */
  async writeFile(name, content = "") {
    const path = this.getPath(name);
    await fs.writeFile(path, content);
    const bytes = Buffer.byteLength(content, 'utf8');
    debug(`Written ${prettyBytes(bytes)} of data to storage file "${name}"`);
  }

}
