// Require modules
const express = require('express');
const pkg = require('@root/package.json');

const myLogger = logger.scope('router');
const middleware = require('./middleware')(myLogger);
const AuthController = require('../controllers/AuthController');

const routes = {
  frontend: require('../routes/frontend'),
  all: require('../routes/all'),
  entry: require('../routes/entry')
};

// Export setup function
module.exports = app => {

  // set data
  app.set('title', `${pkg.name} v${pkg.version}`);
  app.set('version', pkg.version);
  app.set('middleware', middleware);

  // debug access logger
  if (DEBUG) app.use((req, res, next) => {
    myLogger.debug('%s %s from %s', req.method, req.url, req.ip);
    next();
  });

  // setup passport routes
  const myAuthController = new AuthController(app);
  app.post('/login', myAuthController.login());
  app.get('/logout', middleware.checkAuthenticated, myAuthController.logout.bind(myAuthController));

  // register frontend routes
  routes.frontend(app);

  // register api routes
  const allRouter = new express.Router({
    mergeParams: true
  });
  routes.all(app, allRouter);
  app.use('/all', allRouter);

  // register entry routes
  const entryRouter = new express.Router({
    mergeParams: true
  });
  routes.entry(app, entryRouter);
  app.use('/entry', entryRouter);
};
