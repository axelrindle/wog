// Require modules
const FrontendController = require('../controllers/FrontendController');
const AuthController = require('../controllers/AuthController');

module.exports = app => {

  const { checkAuth } = app.get('middleware');
  const myController = new FrontendController(app);
  const myAuthController = new AuthController(app);

  app.get('/login', checkAuth.not, myController.login.bind(myController));
  app.post('/login', checkAuth.not, myAuthController.login());
  app.get('/logout', checkAuth.is, myAuthController.logout.bind(myAuthController));

  app.get('/', checkAuth.is, myController.index.bind(myController));
  app.get('/about', myController.about.bind(myController));

};
