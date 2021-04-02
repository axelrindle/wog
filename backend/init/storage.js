// Require modules
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const prettyBytes = require('pretty-bytes');
const rimraf = require('rimraf');
const debug = require('debug')('wog:storage');

/** @type {import('@wogjs/types').Storage} */
module.exports = class Storage {

  constructor() {
    this._root = path.join(ROOT_DIRECTORY, 'storage');
  }

  getPath(name = "") {
    return path.join(this._root, name);
  }

  async createDirectory(name) {
    const path = this.getPath(name);
    await fsPromises.mkdir(path, {
      recursive: true // like 'mkdir -p'
    });
    debug('Init storage directory%s', name ? ` ${name}` : "");
    return path;
  }

  async exists(name) {
    const absolute = this.getPath(name);
    await fsPromises.access(absolute, fs.constants.F_OK);
    return Promise.resolve(true);
  }

  async isOfType(name, type) {
    const absolute = this.getPath(name);
    const stat = await fsPromises.stat(absolute);
    switch (type) {
      case 'file':
        return stat.isFile();
      case 'directory':
        return stat.isDirectory();
      default:
        return false;
    }
  }

  async writeFile(name, content = "") {
    const path = this.getPath(name);
    await fsPromises.writeFile(path, content);
    const bytes = Buffer.byteLength(content, 'utf8');
    debug(`Written ${prettyBytes(bytes)} of data to storage file "${name}"`);
  }

  async readFile(name, stream = false) {
    const path = this.getPath(name);
    if (stream) {
      return fs.createReadStream(path);
    }
    else {
      return fsPromises.readFile(path)
    }
  }

  delete(path) {
    return new Promise((resolve, reject) => {
      rimraf(path, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

}
