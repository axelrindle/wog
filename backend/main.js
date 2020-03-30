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

// Create global instances
global.storage = require('./init/storage');
global.config = require('./init/config');
global.logger = require('./init/logger');
global.adapters = require('./init/adapter-manager');
global.accounts = require('./init/accounts');

if (DEBUG) logger.warn('DEBUG MODE ENABLED! REMEMBER TO TURN OFF!');

// call init functions in an async scope
(async () => {
  try {
    await storage.init();
    await adapters.init();
    await accounts.init();

    require('./init/server');
  } catch (error) {
    fail(error);
  }
})();
