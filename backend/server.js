// Require modules
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const express = require('express');
const helmet = require('helmet');
const { fail } = require('./util');

const myLogger = logger.scope('server');
const app = require('express-ws')(express()).app;

myLogger.await('Starting webserver...');

// Checks
if (!config.app.url) fail('No url specified!');

// Server setup
app.set('view engine', 'pug');
app.set('views', 'frontend/pug');
if (!DEBUG) {
  app.enable('view cache');
}
app.use(express.static('frontend/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.secure.secret));
app.use(flash());
app.use(helmet());
require('./app/locals').global(app);

// Setup routes
require('./app/routes')(app);

// Start server
const port = config.app.port;
app.listen(port, () => myLogger.success(`Listening on port ${port}.`));
