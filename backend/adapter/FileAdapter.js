// Require modules
const util = require('util');
const fs = require('fs').promises;
const path = require('path');
const glob = require('glob-all');
const isFile = require('is-file');
const prettyBytes = require('pretty-bytes');
const FSWatcher = require('chokidar').FSWatcher;
const BaseAdapter = require('./BaseAdapter');

const globPromisified = util.promisify(glob);

/**
 * The FileAdapter reads and watches files on the local disk.
 *
 * @extends BaseAdapter
 */
class FileAdapter extends BaseAdapter {
  init() {
    this.logger.await(`Loading files...`);
    return this.loadFiles();
  }

  dispose() {
    this.watcher.close();
    this.logger.info('Disposed.');
  }

  loadFiles() {
    // glob all files specified by the given patterns
    return globPromisified(this.options.glob, { silent: true })
      .then(files => {
        this.files = files
          .filter(el => isFile(el)) // make sure we only have files
          .map(el => ({
            id: this.generateId(), // an id for easy access
            name: path.basename(el),
            path: el
          }));

        this.createFileWatcher();
        this.logger.complete(`Initially loaded ${this.files.length} files.`);
      });
  }

  createFileWatcher() {
    this.watcher = new FSWatcher()
      //.on('add', path => this.handleFileEvent('add', path))
      .on('change', path => this.handleFileEvent('change', path))
      .on('unlink', path => {
        const entry = this.files.find(el => el.path === path);
        const index = this.files.indexOf(entry);
        if (index > -1) {
          this.files.splice(index, 1);
          this.logger.info(`The file at '${path}' has been deleted.`);
          this.handleFileEvent('unlink', path);
        }
      })
      .on('error', error => this.handleFileEvent('error', error));
    this.logger.info('File watching initialized.');
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
        const lines = contents.split('\n');
        result.lines = lines;
        return result;
      });
  }

  download(res, id) {
    const entry = this.getEntry(id);
    if (entry !== null) {
      res.download(entry.path);
    } else {
      res.status(404).json({ type: 'error', data: `No file found with id ${id}!` });
    }
  }

  watchEntry(id) {
    this.watcher.add(this.getEntry(id).path);
  }

  handleFileEvent(event, path) {
    if (DEBUG) this.logger.debug(`${event}: ${path}`);
    Object.values(this.sockets).forEach(el => {
      el.send(JSON.stringify({
        type: event, path
      }));
    });
  }
}

module.exports = FileAdapter;
