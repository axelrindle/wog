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
 */
class FileAdapter extends BaseAdapter {

  init() {
    this.logger.info(`Loading files...`);
    this.files = {};
    return this.loadFiles();
  }

  dispose() {
    this.watcher.close();
    this.logger.info('Disposed.');
  }

  loadFiles() {
    const promises = [];
    let counter = 0;
    let groups = this.options.groups;

    Object.keys(groups).forEach(group => {
      promises.push(
        globPromisified(groups[group], { silent: true })
          .then(files => {
            this.files[group] = files
              .filter(el => isFile(el)) // make sure we only have files
              .map(el => ({
                id: this.generateId(), // an id for easy access
                name: path.basename(el),
                path: el
              }));

              counter += this.files[group].length;
          })
      );
    });

    return Promise.all(promises).then(() => {
      this.createFileWatcher();
      this.logger.info(`Initially loaded ${counter} files.`);
    });
  }

  createFileWatcher() {
    const findByPath = path => {
      for (const group of this.getGroups()) {
        const found = this.files[group].find(el => el.path === path);
        if (found) return found;
      }

      return null;
    };

    this.watcher = new FSWatcher()
      //.on('add', path => this.handleFileEvent('add', path))
      .on('change', path => {
        const entry = findByPath(path);
        this.handleFileEvent('change', path, entry.id);
      })
      .on('unlink', path => {
        const entry = findByPath(path);
        const index = this.files.indexOf(entry);
        if (index > -1) {
          this.files.splice(index, 1);
          this.logger.info(`The file at '${path}' has been deleted.`);
          this.handleFileEvent('unlink', path, entry.id);
        }
      })
      .on('error', error => this.handleFileEvent('error', error));
    this.logger.info('File watching initialized.');
  }

  getGroups() {
    return Object.keys(this.files);
  }

  getEntries(group) {
    return this.files[group];
  }

  getEntry(id) {
    for (const group of this.getGroups()) {
      const found = this.files[group].find(el => el.id === id);
      if (found) return found;
    }

    return null;
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

  watchEntry(wsId, entryId) {
    // remove previous file from watching, if any
    if (this.watchMap[wsId]) {
      this.watcher.unwatch(this.getEntry(this.watchMap[wsId]).path);
    }
    super.watchEntry(wsId, entryId); // update map
    this.watcher.add(this.getEntry(entryId).path);
  }

  handleFileEvent(event, path, entryId) {
    if (DEBUG) this.logger.debug(`${event}: ${path}`);

    // find associated socket(s)
    for (let wsId in this.watchMap) {
      let _entryId = this.watchMap[wsId];
      if (_entryId == entryId) {
        const socket = this.sockets[wsId];
        socket.send(JSON.stringify({
          type: event, path
        }));
      }
    }
  }
}

module.exports = FileAdapter;
