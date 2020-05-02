// Require modules
const path = require('path');
const versionCheck = require('github-version-checker');
const pkg = require(path.join(ROOT_DIRECTORY, 'package.json'));

const myLogger = logger.scope('updater');
const updateOpts = {
  owner: 'axelrindle',
  repo: 'wog',
  currentVersion: pkg.version,
  latestOnly: true
};

module.exports = async () => {
  const update = await versionCheck(updateOpts);
  if (update) {
    myLogger.info("An update is available! " + update.name);
    myLogger.info('More infos here: ' + update.url);
    myLogger.info("You are on version " + updateOpts.currentVersion + "!");
  }
};
