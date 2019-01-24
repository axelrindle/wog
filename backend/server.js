// Require modules
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const express = require('express');
const helmet = require('helmet');

const app = require('express-ws')(express()).app;

logger.await('Starting webserver...');

// Checks
if (!config.app.url) fail('No url specified!');

// Server setup
app.set('view engine', 'pug');
app.set('views', 'frontend/pug');
app.use(express.static('frontend/static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.secure.secret));
app.use(flash());
app.use(helmet());
require('./app/locals')(app);

// Setup routes
require('./app/routes')(app);

// Start server
const port = config.app.port;
app.listen(port, () => logger.success(`Listening on port ${port}.`));
