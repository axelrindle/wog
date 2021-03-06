// Require modules
const { bindFn, url } = require('@wogjs/utils');
const AccountController = require('../controllers/AccountController');

const { UpdateUserValidator } = require('../validation/AccountValidators');

/**
 * @param {import('express').Application} app
 * @param {import('express-ws').Router} myRouter
 */
module.exports = (app, myRouter) => {

  const container = app.get('container');
  const { checkAuth } = app.get('middleware');
  const myController = new AccountController(app);

  myRouter.use(checkAuth.is);

  myRouter.get('/', (req, res) => res.redirect( url('account/overview') ));
  myRouter.get('/overview', bindFn(myController, "showAccount"));
  myRouter.post('/update', bindFn(new UpdateUserValidator(container), "validate"), bindFn(myController, "updateAccount"));

  app.use('/account', myRouter);

};
