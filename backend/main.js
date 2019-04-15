'use strict';

// Register any modules/services
require('module-alias/register');

// Load the environment
require('dotenv').config();

// Define global variables
global.DEBUG = process.env.DEBUG || false;
global.logger = require('signale');
require('./util');
require('./config');

if (DEBUG) logger.warn('DEBUG MODE ENABLED! REMEMBER TO TURN OFF!');

// Load log files
require('./files');

// Start the server
require('./server');
