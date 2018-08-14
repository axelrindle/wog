// Require modules
const fs = require('fs');

const auth = require('./auth');
const pkg = require('../package.json');

const title = `${pkg.name} v${pkg.version}`;
const checkAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) next();
    else res.redirect('/login');
};

// Export setup function
module.exports = (app, config) => {

  // instantiate passport
  const passport = auth(app);
  const passportMiddleware = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  });

  // login post
  app.get('/login', (req, res) => {
    res.render('login', {
      title: `${title} | about`
    });
  });
  app.post('/login', passportMiddleware);
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });

  // index
  app.get('/', checkAuthenticated, (req, res) => {
    res.render('overview', {
      title: `${title} | overview`,
      wsPort: config.webSocketPort
    });
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
