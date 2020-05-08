// Require modules
const child_process = require('child_process');
const nanoid = require('nanoid/generate');

const { NANOID_ALPHABET } = require('../util');

/**
 * The WorkerManager is a small utility class for starting a background worker process
 * to outsource intensive work, for example I/O disk operations. Running such things on a
 * background process takes the load off from the main server process and thus increases
 * stability and response speed.
 */
module.exports = class WorkerManager {

  /**
   * Constructs a new WorkerManager instance.
   *
   * @param {Object} logger
   * @param {string} workerPath
   */
  constructor(logger, workerPath) {
    this.logger = logger;
    this.messageListeners = {};
    this.initWorkers(workerPath);
  }

  initWorkers(workerPath) {
    this.worker = child_process.fork(workerPath, null, {
      serialization: 'advanced'
    });
    this.worker.on('message', msg => {
      // get listener by id, call it and delete it
      // the id *MUST* be sent back by the worker
      const listenerId = msg.listenerId;
      const listener = this.messageListeners[listenerId];
      listener(msg);
      delete this.messageListeners[listenerId];
    });
    this.worker.on('exit', () => {
      if (DEBUG && this.logger) this.logger.debug('A worker with PID ' + this.worker.pid + ' exited.');
    });
    if (DEBUG && this.logger) this.logger.debug('A worker with PID ' + this.worker.pid + ' was forked.');
  }

  dispose() {
    this.worker.kill(); // TODO: Use disconnect instead to shut down gracefully
  }

  /**
   * Sends a message to the worker process.
   *
   * @param {any} msg The message to send.
   */
  send(msg) {
    this.worker.send(msg);
  }

  /**
   * Stores a new listener in this manager. This should be done *BEFORE*
   * calling send().
   *
   * @param {Function} handler The listener function taking an object as it's only parameter.
   */
  listen(handler) {
    const listenerId = nanoid(NANOID_ALPHABET, 10);
    this.messageListeners[listenerId] = handler;
    return listenerId;
  }

  /**
   * Utility function for creating a Promise that does nothing more than installing a standard
   * listener and sending a message to the worker afterwards.
   *
   * @param {any} msg The message to send to the worker.
   */
  normPromise(msg) {
    return new Promise((resolve, reject) => {
      const listenerId = this.listen(msg => {
        switch (msg.type) {
          case 'success':
            resolve(msg.data);
            break;
          case 'error':
          default:
            reject(msg.data);
            break;
        }
      });
      this.send(Object.assign(msg, { listenerId }));
    });
  }

};
