// Require modules
const path = require('path');
const glob = require('glob-all');

logger.await('Loading configuration...');

// Find config files
const files = glob.sync(path.join(path.dirname(__dirname), 'config/*.js'));
// TODO: Replace entries in config files with default placeholders. Actual values should be read from an extra file (like in laravel: .env)

// Create config object
const config = {};
files.forEach(el => {
  const namespace = path.basename(el, '.js');
  config[namespace] = require(el);
});

// Make the config object global
global.config = Object.freeze(config);
logger.complete('Configuration loaded.');
