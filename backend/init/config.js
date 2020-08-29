// Require modules
const fs = require('fs');
const path = require('path');
const glob = require('glob-all');

/**
 * Finds a valid .env file out of valid locations.
 */
const envPath = () => {
  const valid = [ '.env', 'storage/.env' ];
  for (const el of valid) {
    const joined = path.join(ROOT_DIRECTORY, el);
    if (fs.existsSync(joined)) {
      return joined;
    }
  }
}

// Load .env file
require('dotenv').config({
  debug: process.env.DEBUG,
  path: envPath()
});

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
