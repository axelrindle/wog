'use strict';

// Register module aliases
require('module-alias/register');

// Require modules
const signale = require('signale');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const express = require('express');
const helmet = require('helmet');

const locals = require('./app/locals');
const routeSetup = require('./app/routes');
const util = require('./util');
const websocket = require('./app/websocket');
const app = require('express-ws')(express()).app;

// Config and defaults
const config = require('../config');
const debug = process.env.DEBUG || false;
const port = config.port || 8080;
const url = config.url || null;
const logs = config.logs || [];

// Check logs
if (logs.length === 0) {
  signale.fatal('No log file locations were supplied!');
  process.exit(-1);
}

// Check url
if (!url) {
  signale.fatal('No url specified!');
  process.exit(-1);
}

// Short debug notice
if (debug) signale.warn('DEBUG MODE ENABLED! REMEMBER TO TURN OFF!');

// Server setup
app.set('view engine', 'pug');
app.set('views', 'frontend/pug');
app.use(express.static('frontend/static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.session.secret));
app.use(flash());
app.use(helmet());
app.locals = locals(config);

(async () => {
  // Load log locations
  signale.await("Collecting log files...");
  try {
    global.files = await util.loadLogFiles(logs);
  } catch(e) {
    signale.fatal(e);
    process.exit(-1);
  }
  signale.complete(`Loaded ${files.transformed.length} log files.`);

  // Init websocket
  app.ws('/socket', (ws, req) => websocket(ws));
  signale.info('WebSocket server accessible via /socket endpoint.');

  // Setup routes
  routeSetup(app, config);

  // Start server
  app.listen(port, () => signale.success(`Listening on port ${port}.`));
})();
