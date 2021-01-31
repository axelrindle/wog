// Require modules
const path = require('path');
const versionCheck = require('github-version-checker');
const pkg = require(path.join(ROOT_DIRECTORY, 'package.json'));
const debug = require('debug')('wog:updater');

const updateOpts = {
  owner: 'wog-js',
  repo: 'wog',
  currentVersion: pkg.version,
  latestOnly: true
};

module.exports = async (container) => {
  const myLogger = container.resolve('logger').scope('updater');
  myLogger.info('Checking for updates...');

  const update = await versionCheck(updateOpts);
  if (update) {
    myLogger.info("An update is available! " + update.name);
    myLogger.info('More infos here: ' + update.url);
    myLogger.info("You are on version " + updateOpts.currentVersion + "!");
    debug(update);
  } else {
    myLogger.info('No updates found.');
  }
};
