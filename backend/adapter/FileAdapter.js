// Require modules
const util = require('util');
const path = require('path');
const glob = require('glob-all');
const isFile = require('is-file');

const BaseAdapter = require('./BaseAdapter');
const WorkerManager = require('../cluster/WorkerManager');

const globPromisified = util.promisify(glob);

/**
 * The FileAdapter reads and watches files on the local disk.
 */
class FileAdapter extends BaseAdapter {

  init() {
    const workerPath = path.join(ROOT_DIRECTORY, 'backend/cluster/FileAdapterWorker');
    this.workerManager = new WorkerManager(this.logger, workerPath);

    this.logger.info(`Loading files...`);
    this.files = {};
    return this.loadFiles();
  }

  dispose() {
    this.workerManager.dispose();
    this.files = {};
    this.logger.info('Disposed.');
  }

  async loadFiles() {
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
          .catch(err => this.logger.error(err))
      );
    });

    await Promise.all(promises);
    this.initWatcherListener();
    this.logger.info('File watching initialized.');
    this.logger.info(`Initially loaded ${counter} files.`);
  }

  initWatcherListener() {
    // helper function for finding a file entry by it's path
    const findByPath = path => {
      for (const group of this.getGroups()) {
        const found = this.files[group].find(el => el.path === path);
        if (found) return found;
      }

      return null;
    };

    this.workerManager.worker.on('message', msg => {
      // only listen for watcher related events
      if (!msg.type.startsWith('watcher')) return;

      switch (msg.type) {
        case 'watcher-change':
          const entry1 = findByPath(msg.path);
          this.handleFileEvent('change', msg.path, entry1.id);
          break;
        case 'watcher-unlink':
          const entry2 = findByPath(msg.path);
          const index = this.files.indexOf(entry2);
          if (index > -1) {
            this.files.splice(index, 1);
            this.logger.info(`The file at '${msg.path}' has been deleted.`);
            this.handleFileEvent('unlink', msg.path, entry2.id);
          }
          break;
        case 'watcher-error':
          this.handleFileEvent('error', msg.error)
          break;
        default:
          this.logger.warn(`Invalid watcher event ${msg.type}!`);
          break;
      }
    });
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
    if (!entry) return Promise.reject(`No entry found with id ${id}!`);
    return this.workerManager.normPromise({
      type: 'getContents',
      path: entry.path
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

  async watchEntry(wsId, entryId) {
    const promises = [];

    // remove previous file from watching, if any
    if (this.watchMap[wsId]) {
      promises.push(this.workerManager.normPromise({
        type: 'watcher',
        watch: false,
        path: this.getEntry(this.watchMap[wsId]).path
      }));
    }

    promises.push(this.workerManager.normPromise({
      type: 'watcher',
      watch: true,
      path: this.getEntry(entryId).path
    }));

    await Promise.all(promises);
    super.watchEntry(wsId, entryId); // update map
  }

  handleFileEvent(event, path, entryId) {
    if (DEBUG) this.logger.debug(`watcher-${event}: ${path}`);

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
