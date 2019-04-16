// Require modules
const fs = require('fs').promises;
const path = require('path');
const glob = require('glob-all');
const isFile = require('is-file');
const prettyBytes = require('pretty-bytes');
const FSWatcher = require('chokidar').FSWatcher;
const BaseAdapter = require('./BaseAdapter');

/**
 * The FileAdapter reads and watches files on the local disk.
 *
 * @extends BaseAdapter
 */
class FileAdapter extends BaseAdapter {
  init() {
    this.logger.await(`Loading files...`);

    this.loadFiles();
    this.createFileWatcher();

    this.logger.complete(`Initially loaded ${this.files.length} files.`);
  }

  loadFiles() {
    // glob all files specified by the given patterns
    this.files = glob.sync(this.options.glob, { silent: true })

      // make sure we only have files
      .filter(el => isFile(el))

      // save name and path for fast access
      // also, generate an id for unique identification
      .map(el => ({
        id: this.generateId(),
        name: path.basename(el),
        path: el
      }));
  }

  createFileWatcher() {
    this.watcher = new FSWatcher()
      .on('change', path => this.emit('change', path))
      .on('unlink', path => this.emit('unlink', path))
      .on('error', error => this.emit('error', error));
  }

  get entries() {
    return this.files;
  }

  getEntry(id) {
    return this.files.find(el => el.id === id);
  }

  getContents(id) {
    const entry = this.getEntry(id);
    const result = {};
    return new Promise((resolve, reject) => {
      if (!entry) reject(`No entry found with id ${id}!`);
      resolve(fs.stat(entry.path));
    })
      .then(stats => {
        result.size = prettyBytes(stats.size);
        return fs.readFile(entry.path, { encoding: 'utf-8' });
      })
      .then(contents => {
        result.contents = contents;
        return result;
      });
  }

  dispose() {
    this.watcher.close();
    this.logger.info('Disposed.');
  }
}

module.exports = FileAdapter;
