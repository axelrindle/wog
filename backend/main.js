'use strict';

// Register any modules/services
const path = require('path');
const moduleAlias = require('module-alias');
const paths = require('../jsconfig.json').compilerOptions.paths;
const aliases = {};
Object.keys(paths).forEach(el => {
  aliases[el] = path.resolve(path.dirname(__dirname), paths[el][0]);
});
moduleAlias.addAliases(aliases);

// Load the environment
require('dotenv').config();

// Define global variables
global.DEBUG = process.env.DEBUG || false;

const signale = require('signale');
signale.config({
  displayTimestamp: true
});
global.logger = signale.scope('main');

require('./config');

if (DEBUG) logger.warn('DEBUG MODE ENABLED! REMEMBER TO TURN OFF!');

// since the adapterManager init function is async,
// we need a top level async executor
(async () => {
  try {
    // Initialize adapters
    require('./adapter-manager');
    await adapters.init();

    // Start the server
    require('./server');
  } catch (error) {
    logger.fatal(error);
    process.exit(-1);
  }
})();
