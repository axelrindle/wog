// Require modules
const auth = require('./auth');
const pkg = require('@root/package.json');
const { getPath } = require('../util');
const locals = require('./locals');

const myLogger = logger.scope('router');
const title = `${pkg.name} v${pkg.version}`;

const checkAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) next();
  else {
    myLogger.warn('Unauthenticated request: ' + req);
    res.redirect(getPath('login'));
  }
};
const requireParameters = list => {
  return (req, res, next) => {
    const missing = [];

    // find missing params
    list.forEach(el => {
      if (!req.body[el] && !req.params[el]) missing.push(el);
    });

    if (missing.length > 0) {
      res.json({ type: 'error', data: `Missing required parameters: "${missing.join()}"` });
    } else {
      next();
    }
  };
}

// Export setup function
module.exports = app => {

  // debug access logger
  if (DEBUG) app.use((req, res, next) => {
    myLogger.debug('%s %s from %s', req.method, req.url, req.ip);
    next();
  });

  app.use((req, res, next) => {
    res.locals = locals.local(req);
    next();
  });

  // Init websocket
  app.ws('/socket', require('./websocket'));
  myLogger.info('WebSocket server accessible via /socket endpoint.');

  // setup passport routes
  const passport = auth(app);
  app.post('/login', passport.authenticate('local', {
    successRedirect: getPath(),
    failureRedirect: getPath(),
    failureFlash: true
  }));
  app.get('/logout', checkAuthenticated, (req, res) => {
    req.logout();
    res.redirect(getPath());
  });

  // index
  app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.render('overview', {
        title: `${title} | overview`,
        wsPort: config.app.socketPort
      });
    } else {
      res.render('login', {
        title: `${title} | login`,
        error: req.flash('error')
      });
    }
  });

  // sends a list of all adapters/entries
  app.post('/all', checkAuthenticated, (req, res) => {
    const type = req.body.type;
    switch (type) {
      case 'adapters':
        res.json(adapters.list());
        break;
      case 'entries': {
        const selectedAdapter = req.body.adapter;
        if (!selectedAdapter) {
          res.status(400).json({ type: 'error', data: 'No adapter selected!' });
        } else {
          res.json(adapters.getAdapter(selectedAdapter).entries);
        }
        break;
      }
      default:
        res.status(400).json({ type: 'error', data: `Unknown type ${type}!` });
        break;
    }
  });

  // sends content of a file
  app.post('/contents', checkAuthenticated, requireParameters(['adapter', 'id']), (req, res) => {
    const adapter = req.body.adapter;
    const entryId = req.body.id;
    const theAdapter = adapters.getAdapter(adapter);
    theAdapter.getContents(entryId)
      .then(contents => {
        res.json(contents);
      })
      .catch(err => {
        theAdapter.logger.error(err.message);
        res.status(500).json({ type: 'error', msg: err.message });
      });
  });

  // download a file
  app.get('/download/:adapter/:id', checkAuthenticated, requireParameters(['adapter', 'id']), (req, res) => {
    // make sure downloading is enabled
    if (!config.app.enableFileDownloads)
      return res.status(403).send('Forbidden!');

    const adapter = req.params.adapter;
    const entryId = req.params.id;
    adapters.getAdapter(adapter).download(res, entryId);
  });

  // about page
  app.get('/about', (req, res) => {
    res.render('about', {
      title: `${title} | about`,
      version: pkg.version
    });
  });

};
