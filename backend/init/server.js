// Require modules
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const express = require('express');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const { fail } = require('../util');

const myLogger = logger.scope('server');
const app = express();

// Checks
if (!config.app.url) fail('No url specified!');

// Configure template engine
nunjucks.configure('frontend/views', {
  noCache: DEBUG,
  express: app,
});

// Server setup
app.set('view engine', 'nunjucks');
app.set('views', 'frontend/views');
if (!DEBUG) {
  app.enable('view cache');
  app.set('trust proxy', config.app.isProxy);
}
app.use(express.static('frontend/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.secure.secret));
app.use(flash());
app.use(helmet());
require('../app/locals')(app);

// Install central error handler
const handleError = (err, req, res, next) => {
  myLogger.error(err.stack);
  res.set('Content-Type', 'text/plain');
  res.status(500).send(err.stack);
};
app.use(handleError);
app.set('error handler', handleError);

// Init websocket
require('../app/websocket')(app);

// Setup routes
require('../app/auth')(app);
require('../app/router')(app);

// Start server
const port = config.app.port;
app.listen(port, () => myLogger.info(`Listening on port ${port}.`));
