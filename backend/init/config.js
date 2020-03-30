// Require modules
const path = require('path');
const glob = require('glob-all');

// Load .env file
require('dotenv').config({ debug: process.env.DEBUG });

// Find config files
const files = glob.sync(path.join(ROOT_DIRECTORY, 'config/*.js'));

// Create config object
const config = {};
files.forEach(el => {
  const namespace = path.basename(el, '.js');
  config[namespace] = require(el);
});

// Export the configuration
module.exports = Object.freeze(config);
