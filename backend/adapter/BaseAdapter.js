/* eslint-disable no-undef */
/* eslint-disable getter-return */
/* eslint-disable no-unused-vars */
// Require modules
const EventEmitter = require('events');
const nanoid = require('nanoid/generate');
const { NANOID_ALPHABET } = require('../util');

/**
 * Throws an error indicating that a function has to be implemented by a sub class.
 */
const unimplemented = () => {
  throw new Error("Not implemented!");
};

/**
 * Describes an adapter for retrieving log entries.
 */
class BaseAdapter extends EventEmitter {

  /**
   * Creates a new Adapter instance.
   * @param {object} options The options for the adapter.
   */
  constructor(options) {
    super();
    this.options = options;
    this.logger = logger.scope(this.name);
    this.sockets = {};
    this.watchMap = {};
  }

  generateId() {
    return nanoid(NANOID_ALPHABET, 10);
  }

  get name() {
    return this.constructor.name;
  }

  /**
   * Indicates whether this adapter will emit events.
   * @return {boolean} Whether events are supported.
   */
  supportsEvents() {
    return true;
  }

  /**
   * Called when this adapter is no longer needed. Used to clean up
   * resources or to close any connections.
   */
  dispose() {
    /* Might be unused ;) */
  }

  registerSocket(id, ws) {
    this.sockets[id] = ws;
  }

  unregisterSocket(id) {
    delete this.sockets[id];
    delete this.watchMap[id];
  }

  // -------------------------------
  // INTERFACE

  init() {
    unimplemented();
  }

  /**
   * Returns a list of all loaded file groups.
   * @return {array} An array with the names of all file groups.
   */
  getGroups() {
    unimplemented();
  }

  /**
   * Returns a list of file entries for a given group.
   * @param {string} group The group name.
   * @returns {array} An array with all file entries associated with the given group.
   */
  getEntries(group) {
    unimplemented();
  }

  /**
   * Finds a specific entry by it's id.
   * @param  {string} id The unique id identifying an entry.
   * @return {object|null|Promise} An object holding an entry's data (name, path, etc.).
   *                               Using Promises is also allowed.
   */
  getEntry(id) {
    unimplemented();
  }

  /**
   * Returns the contents for an entry.
   * @param  {string} id The unique id identifying an entry.
   * @param  {number} page Specifies the page to read the corresponding lines.
   * @return {array|object} An array containing the log entries, where each element represents one line/log.
   *                        Also supported is an object with additional information (size, dates, etc.).
   */
  getContents(id, page = 1) {
    unimplemented();
  }

  /**
   * Downloads the contents for the given entry as a file.
   * @param  {Response} res The response object.
   * @param  {string} id The entry id.
   */
  download(res, id) {
    unimplemented();
  }

  watchEntry(wsId, entryId) {
    this.watchMap[wsId] = entryId;
  }
}

module.exports = BaseAdapter;
