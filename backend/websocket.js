// Require modules
const chokidar = require('chokidar');


// Export init function
module.exports = (ws, files) => {

  let watcher = null;

  function stopWatching() {
    if (watcher) {
      watcher.close();
      watcher = null;
    }
  }

  // handlers
  ws.on('message', index => {

    // if already watching destroy the previous instance
    stopWatching();

    // begin watching
    watcher = chokidar.watch(files[index].absolute);
    watcher
      .on('change', path => ws.send('file-was-updated'))
      .on('unlink', path => ws.send('error', 'File was deleted!'))
      .on('error', error => ws.send('error', error));

  });

  ws.on('close', () => stopWatching());
};
