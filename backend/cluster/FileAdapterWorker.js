// Require modules
/* const cluster = require('cluster');
const numCpus = require('os').cpus().length;

// Fork up to `numCpus` forks of this process to utilize all available CPU cores
if (cluster.isMaster) {
  for (let i = 1; i <= numCpus; i++) {
    cluster.fork();
  }
  return;
}
 */
// TODO: Use clustering to balance the load onto multiple CPU cores
const { sendMessage, sendNormMessage } = require('./utils');
const fs = require('fs').promises;
const prettyBytes = require('pretty-bytes');
const FSWatcher = require('chokidar').FSWatcher;

const watcher = new FSWatcher()
  .on('change', path => sendMessage({ type: 'watcher-change', path }))
  .on('unlink', path => sendMessage({ type: 'watcher-unlink', path }))
  .on('error', error => sendMessage({ type: 'watcher-error', error}));

/**
 * Reads a file's size and contents.
 *
 * @param {string} path The path to the file.
 * @returns {Promise} A Promise that resolves with the result object.
 */
const readFile = async path => {
  const result = {};

  // attach estimate file size
  const stats = await fs.stat(path);
  result.size = prettyBytes(stats.size);

  // read lines
  const contents = await fs.readFile(path, { encoding: 'utf-8' });
  const lines = contents.split('\n');
  result.lines = lines;

  return result;
};

const handleMessage = msg => {
  switch (msg.type) {
    case 'getContents':
      readFile(msg.path)
        .then(result => sendNormMessage('success', msg, result))
        .catch(err => sendNormMessage('error', msg, err.message));
      break;
    case 'watcher':
      watcher[msg.watch ? 'add' : 'unwatch'](msg.path);
      sendNormMessage('success', msg, null);
      break;
    default:
      sendNormMessage('error', msg, `Invalid handle type ${msg.type}!`);
      break;
  }
};

// The master process will send the file path to read
process.on('message', handleMessage);
