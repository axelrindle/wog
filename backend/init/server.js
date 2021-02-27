// Require modules
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const express = require('express');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const { createTerminus } = require('@godaddy/terminus');
const { isDebug, fail } = require('../utils');

module.exports = container => {

// Resolve services
const logger = container.resolve('logger');
const config = container.resolve('config');

const myLogger = logger.scope('server');
const app = express();

// Checks
if (!config.app.url) fail('No url specified!');

// Configure template engine
const nunjucksEnvironment = nunjucks.configure('frontend/views', {
  noCache: isDebug,
  express: app
});

// Server setup
app.set('container', container);
app.set('view engine', 'nunjucks');
app.set('views', 'frontend/views');
if (! isDebug) {
  app.enable('view cache');
  if (config.app.isProxy) app.enable('trust proxy');
}
app.use(express.static('frontend/static'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.secure.secret));
app.use(flash());
app.use(helmet());
app.use(require('../app/locals'));

// Install central error handler
// eslint-disable-next-line no-unused-vars
const handleError = (err, req, res, next) => {
  myLogger.error(err.stack);
  res.set('Content-Type', 'text/plain');
  res.status(500).send(err.stack);
};
app.use(handleError);
app.set('error handler', handleError);

// Init websocket
const websocket = require('../app/websocket')(app);

// Setup routes
require('../app/auth')(app);
require('../app/router')(app);

// Start server
const port = config.app.port;
const server = app.listen(port, () => myLogger.info(`Listening on port ${port}.`));

// Install terminus graceful shutdown
createTerminus(server, {
  signals: ['SIGINT', 'SIGTERM'],
  logger: (msg, err) => {
    myLogger.error(msg);
    console.error(err);
  },
  onSignal: () => {
    myLogger.info('Shutting down...');
    return Promise.all([
      websocket.dispose(),
      container.resolve('database').dispose(),
      container.resolve('mailer').dispose(),
      container.resolve('redis').dispose()
    ]);
  }
});

};
