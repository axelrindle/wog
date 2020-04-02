// Require modules
const path = require('path');
const glob = require('glob');
const { Router } = require('express');
const pkg = require('@root/package.json');

const myLogger = logger.scope('router');
const middleware = require('./middleware')(myLogger);

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

  // load route definitions
  const dir = path.join(__dirname, '../routes/*.js');
  const files = glob.sync(dir);

  // require each file and execute it's init function
  files.forEach(file => {
    const routeInit = require(file);

    // function wants app and a new router
    if (routeInit.length === 2) {
      const myRouter = new Router({
        mergeParams: true
      });
      routeInit(app, myRouter);
    }

    // function only wants app
    else if (routeInit.length === 1) {
      routeInit(app);
    }

    // illegal
    else {
      throw new Error(`Invalid parameter count in router function: ${routeInit.length}! Must be 1 or 2!`)
    }
  });

  myLogger.info(`Loaded ${files.length} route definitions.`);
};
