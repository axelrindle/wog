// Require modules
const path = require('path');
const glob = require('glob-all');

// Find config files
const files = glob.sync(path.join(path.dirname(__dirname), 'config/*.js'));

// Create config object
const config = {};
files.forEach(el => {
  const namespace = path.basename(el, '.js');
  config[namespace] = require(el);
});

// Export the configuration
module.exports = Object.freeze(config);
