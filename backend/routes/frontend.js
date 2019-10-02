// Require modules
const { getPath } = require('../util');

module.exports = app => {

  // get middleware
  const { checkAuthenticated } = app.get('middleware');

  // get data
  const title = app.get('title');
  const version = app.get('version');

  // index
  app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      const wsUrl = config.app.isProxy ?
        `${req.protocol.replace('http', 'ws')}://${req.hostname.split(':')[0]}:${config.app.socketPort}` :
        `${config.app.url}${config.app.url.endsWith('/') ? '' : '/'}socket`;
      res.render('overview', {
        title: `${title} | overview`,
        user: req.user,
        wsUrl
      });
    } else {
      res.render('login', {
        title: `${title} | login`,
        error: req.flash('error')
      });
    }
  });

  // administration
  app.get('/admin', checkAuthenticated, (req, res) => {
    if (req.user.role === 'admin') {
      res.render('administration', {
        title: `${title} | administration`,
        user: req.user
      });
    } else {
      res.redirect(getPath());
    }
  });

  // about page
  app.get('/about', (req, res) => {
    res.render('about', {
      title: `${title} | about`,
      version
    });
  });
};
