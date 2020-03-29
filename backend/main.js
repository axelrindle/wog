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

const { fail } = require('./util');

// Define global variables
global.DEBUG = process.env.DEBUG || false;
global.ROOT_DIRECTORY = path.resolve(__dirname, '..');

// Load environment variables and configuration
require('dotenv').config();
global.config = require('./config');

// Create logger
global.logger = require('./logger');

if (DEBUG) logger.warn('DEBUG MODE ENABLED! REMEMBER TO TURN OFF!');

// Initialize adapters
global.adapters = require('./adapter-manager');

// Initialize server
const startServer = require('./server');

// since the adapterManager init function is async,
// we need a top level async executor
(async () => {
  try {
    await adapters.init();

    startServer();
  } catch (error) {
    fail(error);
  }
})();
