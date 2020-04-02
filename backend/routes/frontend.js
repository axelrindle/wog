// Require modules
const FrontendController = require('../controllers/FrontendController');
const AuthController = require('../controllers/AuthController');

module.exports = app => {

  const { checkAuthenticated } = app.get('middleware');
  const myController = new FrontendController(app);
  const myAuthController = new AuthController(app);

  app.post('/login', myAuthController.login());
  app.get('/logout', checkAuthenticated, myAuthController.logout.bind(myAuthController));

  app.get('/', myController.index.bind(myController));
  app.get('/about', myController.about.bind(myController));

  if (DEBUG) {
    app.get('/admin', checkAuthenticated, myController.admin.bind(myController));
  }

};
