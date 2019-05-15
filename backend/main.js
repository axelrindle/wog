'use strict';

// Register any modules/services
require('module-alias/register');

// Load the environment
require('dotenv').config();

// Define global variables
global.DEBUG = process.env.DEBUG || false;

const signale = require('signale');
signale.config({
  logLevel: DEBUG ? 'debug' : 'info',
  displayTimestamp: true
});
global.logger = signale.scope('main');

require('./config');

if (DEBUG) logger.warn('DEBUG MODE ENABLED! REMEMBER TO TURN OFF!');

// since the adapterManager init function is async,
// we need a top level async executor
(async () => {
  // Initialize adapters
  require('./adapter-manager');
  await adapters.init();

  // Start the server
  require('./server');
})();
