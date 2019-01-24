// Require modules
const fs = require('fs');
const path = require('path');

const glob = require('glob-all');
const isFile = require('is-file');
const prettyBytes = require('pretty-bytes');
const nanoid = require('nanoid/generate');
const FSWatcher = require('chokidar').FSWatcher;

logger.await('Loading files...');

// Set up file watching
const listeners = {};
/**
 * Called by FSWatcher callbacks to send an event to the associated socket connection.
 *
 * @param  {string} event The event name.
 * @param  {any}    argument The supplied argument.
 */
const handleListener = (event, argument) => {
  // an error is sent to all listeners
  if (event === 'error') {
    objectKeyLoop(listeners, el => {
      listeners[el]('error', argument);
    });
  } else {
    listeners[argument](event, argument);
  }
};
const watcher = new FSWatcher()
  .on('change', path => handleListener('change', path))
  .on('unlink', path => handleListener('unlink', path))
  .on('error', error => handleListener('error', error));

// glob all files specified by the given patterns
const globbed = glob.sync(config.files, { silent: true })

  // make sure we only have files
  .filter(el => isFile(el))

  // save name and path for fast access
  // also, generate an id for unique identification
  .map(el => ({
    id: nanoid(NANOID_ALPHABET, 10),
    name: path.basename(el),
    path: el
  }));

/**
 * Finds a file object by it's id.
 *
 * @param  {string} id   The file id.
 * @param  {bool}   fail Whether to throw an exception when nothing was found;
 * @return {object}      The file object.
 */
function find(id, fail = true) {
  return globbed.find(el => el.id === id);
}

// return adapter object
global.files = {
  find,

  all() {
    return globbed;
  },

  read(id) {
    let target = find(id);
    let size = prettyBytes(fs.statSync(target.path).size);
    return {
      size,
      contents: fs.readFileSync(target.path).toString().trim()
    };
  },

  addListener(ws, id) {
    const file = find(id).path;
    listeners[file] = (type, data) => ws.send({ type, data });
  },

  removeListener(ws, id) {
    const file = find(id).path;
    delete listeners[file];
  },
};
logger.complete(`Initially loaded ${files.all().length} files.`);
