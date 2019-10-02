// Require modules
const express = require('express');
const auth = require('./auth');
const pkg = require('@root/package.json');
const { getPath } = require('../util');

const myLogger = logger.scope('router');
const middleware = require('./middleware')(myLogger);

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
  const passport = auth(app);
  app.post('/login', passport.authenticate('local', {
    successRedirect: getPath(),
    failureRedirect: getPath(),
    failureFlash: true
  }));
  app.get('/logout', middleware.checkAuthenticated, (req, res) => {
    req.logout();
    res.redirect(getPath());
  });

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
