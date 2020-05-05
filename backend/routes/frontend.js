// Require modules
const FrontendController = require('../controllers/FrontendController');
const AuthController = require('../controllers/AuthController');
const ResetPasswordController = require('../controllers/ResetPasswordController');

module.exports = app => {

  const { checkAuth } = app.get('middleware');
  const myController = new FrontendController(app);
  const myAuthController = new AuthController(app);
  const myResetController = new ResetPasswordController(app);

  app.get('/login', checkAuth.not, myController.login.bind(myController));
  app.post('/login', checkAuth.not, myAuthController.login());
  app.get('/logout', checkAuth.is, myAuthController.logout.bind(myAuthController));

  app.get('/', checkAuth.is, myController.index.bind(myController));
  app.get('/about', myController.about.bind(myController));

  app.get('/reset/password', checkAuth.not, myResetController.showRequestForm.bind(myResetController));
  app.post('/reset/password', checkAuth.not, myResetController.handleRequest.bind(myResetController));
  app.get('/reset/password/:token', checkAuth.not, myResetController.showResetForm.bind(myResetController));
  app.post('/reset/password/:token', checkAuth.not, myResetController.handleReset.bind(myResetController));

};
