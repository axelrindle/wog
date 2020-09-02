// Require modules
const { bind, getPath } = require('../util');
const AccountController = require('../controllers/AccountController');

const { UpdateUserValidator } = require('../validation/AccountValidators');

module.exports = (app, myRouter) => {

  const { checkAuth } = app.get('middleware');
  const myController = new AccountController(app);

  myRouter.use(checkAuth.is);

  myRouter.get('/', (req, res) => res.redirect(getPath('/account/overview')));
  myRouter.get('/overview', bind(myController, "showAccount"));
  myRouter.post('/update', bind(UpdateUserValidator, "validate"), bind(myController, "updateAccount"));

  app.use('/account', myRouter);

};
