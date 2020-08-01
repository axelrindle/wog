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
const lineReader = require('line-reader');

const MAX_LINE_AMOUNT = 500;

const watcher = new FSWatcher()
  .on('change', path => sendMessage({ type: 'watcher-change', path }))
  .on('unlink', path => sendMessage({ type: 'watcher-unlink', path }))
  .on('error', error => sendMessage({ type: 'watcher-error', error}));

/**
 * Reads a file's size and contents.
 *
 * @param {string} path The path to the file.
 * @returns {Promise<FileResult>} A Promise that resolves with the result object.
 */
const readFile = async (path, page = 1) => {
  /** @type {FileResult} */
  const result = { page, limit: MAX_LINE_AMOUNT };

  // attach estimate file size
  const stats = await fs.stat(path);
  result.size = prettyBytes(stats.size);

  // read lines
  result.lines = await new Promise((resolve, reject) => {

    // calculate range based on page
    const pageStart = (page - 1) * MAX_LINE_AMOUNT;

    const list = [];
    let lineCounter = 0;
    lineReader.eachLine(path, line => {

      // collect lines until the limit is reached
      if (lineCounter >= pageStart && list.length < MAX_LINE_AMOUNT) {
        list.push(line);
      }

      lineCounter++;
    }, err => {
      if (err) reject(err);
      else {
        result.totalLines = lineCounter;
        result.pageStart = pageStart + 1;
        result.pageEnd = pageStart + MAX_LINE_AMOUNT;
        if (result.pageEnd > lineCounter) result.pageEnd = lineCounter;
        result.maxPage = Math.ceil(lineCounter / MAX_LINE_AMOUNT);
        resolve(list);
      }
    });
  });

  return result;
};

/**
 * @param {FileWorkerMessageReceive} msg
 */
const handleMessage = msg => {
  switch (msg.type) {
    case 'getContents':
      readFile(msg.path, msg.page)
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
