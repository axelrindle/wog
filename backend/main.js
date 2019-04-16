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

require('./util');
require('./config');

if (DEBUG) logger.warn('DEBUG MODE ENABLED! REMEMBER TO TURN OFF!');

// Initialize adapters
require('./adapter-manager');

// Start the server
require('./server');
