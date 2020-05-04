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
  if (config.app.isProxy) app.enable('trust proxy');
}
app.use(express.static('frontend/static'));
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

// Register graceful shutdown hook
const gracefulShutdownHandler = () => {
  logger.info('Shutting down...');

  websocket.close(err => {
    if (err) logger.error(err);
    logger.info('Websocket closed.');

    server.close(err2 => {
      if (err) logger.error(err2);
      logger.info('Server closed.');

      adapters.dispose();
      logger.info('Adapters disposed.');

      logger.info('Goodbye :)');
      process.exit(0);
    });
  })
};
process.on('SIGINT', gracefulShutdownHandler);
process.on('SIGTERM', gracefulShutdownHandler);
