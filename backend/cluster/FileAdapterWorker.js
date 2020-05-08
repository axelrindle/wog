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
const fs = require('fs').promises;
const prettyBytes = require('pretty-bytes');

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
  readFile(msg.path)
    .then(result => {
      process.send({ type: 'success', data: result, listenerId: msg.listenerId }, null, {}, err => {
        if (err) console.error(err);
      });
    })
    .catch(err => {
      process.send({ type: 'error', data: err.message, listenerId: msg.listenerId }, null, {}, err => {
        if (err) console.error(err);
      });
    });
};

// The master process will send the file path to read
process.on('message', handleMessage);
