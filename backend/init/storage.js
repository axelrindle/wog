// Require modules
const fs = require('fs').promises;
const path = require('path');

/**
 * The Storage class is a small utility for working with files within the `storage/` directory.
 */
class Storage {

  constructor() {
    this.root = path.join(ROOT_DIRECTORY, 'storage');
    this.directoryRegistry = [];
  }

  /**
   * Creates all registered directories if they don't exist.
   *
   * @returns {Promise} A Promise which resolves when all registered directories have been created.
   */
  init() {
    return Promise.all([
      this.createDirectory(),
      ...this.directoryRegistry.map(el => this.createDirectory(el))
    ]);
  }

  /**
   * Register a new directory to be created in storage.
   *
   * @param {string} name The directory name.
   * @returns {string} The absolute directory path.
   */
  register(name) {
    this.directoryRegistry.push(name);
    return this.getPath(name);
  }

  /**
   * Build the absolute path to a directory or file in the storage.
   *
   * @param {string} name The relative path.
   * @returns {Promise} A promise.
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
  createDirectory(name) {
    const path = this.getPath(name);
    return fs.mkdir(path, {
      recursive: true // like 'mkdir -p'
    });
  }

  /**
   * Writes content to a file. The file is created if it does not exist.
   * Note that existing files are overwritten.
   *
   * @param {string} name The file name.
   * @param {string} content The content. Defaults to nothing.
   * @returns {Promise} A promise.
   */
  writeFile(name, content = "") {
    const path = this.getPath(name);
    return fs.writeFile(path, content);
  }

}

// Export class instance
module.exports = new Storage();
