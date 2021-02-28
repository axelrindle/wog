// Require modules
const { bindFn } = require('@wogjs/utils');
const FrontendController = require('../controllers/FrontendController');
const AuthController = require('../controllers/AuthController');
const ResetPasswordController = require('../controllers/ResetPasswordController');

/**
 * @param {import('express').Application} app
 */
module.exports = app => {

  const { checkAuth } = app.get('middleware');
  const myController = new FrontendController(app);
  const myAuthController = new AuthController(app);
  const myResetController = new ResetPasswordController(app);

  app.get('/login', checkAuth.not, bindFn(myController, "login"));
  app.post('/login', checkAuth.not, myAuthController.login());
  app.get('/logout', checkAuth.is, bindFn(myAuthController, "logout"));

  app.get('/', checkAuth.is, bindFn(myController, "index"));
  app.get('/about', bindFn(myController, "about"));

  app.get('/reset/password', checkAuth.not, bindFn(myResetController, "showRequestForm"));
  app.post('/reset/password', checkAuth.not, bindFn(myResetController, "handleRequest"));
  app.get('/reset/password/:token', checkAuth.not, bindFn(myResetController, "showResetForm"));
  app.post('/reset/password/:token', checkAuth.not, bindFn(myResetController, "handleReset"));

};
