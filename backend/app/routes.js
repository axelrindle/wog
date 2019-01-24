// Require modules
const fs = require('fs');

const auth = require('./auth');
const pkg = require('@root/package.json');

const title = `${pkg.name} v${pkg.version}`;

const checkAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) next();
    else res.redirect('/login');
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

  // Init websocket
  app.ws('/socket', checkAuthenticated, require('./websocket'));
  logger.note('WebSocket server accessible via /socket endpoint.');

  // instantiate passport
  const passport = auth(app);

  // login post
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
  }));
  app.get('/logout', checkAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/');
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

  // sends a list of all files
  app.post('/all', checkAuthenticated, (req, res) => {
    res.json(files.all());
  });

  // sends content of a file
  app.post('/:id', checkAuthenticated, requireParameters(['id']), (req, res) => {
    try {
      const contents = files.read(req.params.id);
      res.json(contents);
    } catch (e) {
      logger.debug(e);
      res.status(500).json({ type: 'error', data: e });
    }
  });

  // download a file
  app.get('/:id/download', checkAuthenticated, requireParameters(['id']), (req, res) => {
    // make sure downloading is enabled
    if (!config.app.enableFileDownloads)
      return res.status(403).send('Forbidden!');

    const id = req.body.id;
    if (!files.find(id)) {
      return res.status(404).send(`No file found with ID "${id}"!`);
    }

    res.download(files.find(id).path);
  });

  // about page
  app.get('/about', (req, res) => {
    res.render('about', {
      title: `${title} | about`,
      version: pkg.version
    });
  });

};
