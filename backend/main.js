'use strict';

// Register custom module paths
require('module-alias/register');

const path = require('path');

// Define global variables
global.ROOT_DIRECTORY = path.resolve(__dirname, '..');

const debug = require('debug')('wog:main');
const isElevated = require('is-elevated');
const chalk = require('chalk');
const { fail } = require('@wogjs/utils');
const checkForUpdates = require('./updater');

debug('DEBUG MODE ENABLED! REMEMBER TO TURN OFF!');

// call init functions in an async scope
(async () => {
  try {

    // Create service container
    const container = await require('./container')();
    debug('Container initialized.');

    const logger = container.resolve('logger');

    // Fail on uncaught exceptions or rejections
    process.on('uncaughtExceptionMonitor', (err, origin) => {
      logger.error('Uncaught exception detected!', { stack: err.stack, origin });
    });
    process.on('unhandledRejection', err => {
      logger.error('Unhandled promise rejection detected!', { stack: err.stack });
      process.exit(1);
    });

    // Check for elevation and print a warning when running with administrative privileges
    if (await isElevated()) {
      logger.warn(chalk.bold('You\'re running with elevated permissions! ' +
        'You should avoid running as root or Administrator and tweak file permissions accordingly.'));
    }

    await checkForUpdates(container);

    debug('Main init done. Starting server...');
    require('./init/server')(container);
  } catch (error) {
    fail(error);
  }
})();
