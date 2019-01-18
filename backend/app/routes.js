// Require modules
const fs = require('fs');

const auth = require('./auth');
const pkg = require('@root/package.json');

const title = `${pkg.name} v${pkg.version}`;
const checkAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) next();
    else res.redirect('/login');
};

// Export setup function
module.exports = (app, config) => {

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
        wsPort: config.webSocketPort
      });
    } else {
      res.render('login', {
        title: `${title} | login`,
        error: req.flash('error')
      });
    }
  });

  // sends a list of all files
  app.post('/all', checkAuthenticated, (req, res) => res.json(files.frontend));

  // sends content of a file
  app.post('/:index', checkAuthenticated, (req, res) => {
    const index = req.params.index;
    const file = files.transformed[index];

    // read the data from the given log file and send it back
    fs.readFile(file.absolute, (err, result) => {
      if (err) {
        signale.error(`Failed reading "${file}": "${err}"`);
        res.status(500).send(err);
      }
      else res.send(result);
    });
  });

  // download a file
  app.get('/:index/download', checkAuthenticated, (req, res) => {
    // make sure downloading is enabled
    if (!config.enableFileDownloads)
      res.status(403).send('Forbidden!');

    const index = req.params.index;
    if (index > -1)
      res.download(files.transformed[index].absolute);
    else
      res.status(400).send('The ID "-1" is invalid!');
  });

  // about page
  app.get('/about', (req, res) => {
    res.render('about', {
      title: `${title} | about`,
      version: pkg.version
    });
  });

};
