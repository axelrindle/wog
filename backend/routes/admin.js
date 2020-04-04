// Require modules
const { bind } = require('../util');
const AdminController = require('../controllers/AdminController');
const { CreateUserValidator } = require('../validation/AdminValidators');

module.exports = (app, myRouter) => {

  const { isAdmin } = app.get('middleware');
  const myController = new AdminController(app);

  myRouter.use(isAdmin);

  myRouter.get('/', bind(myController, "index"));
  myRouter.post('/user/list', bind(myController, "listUsers"));
  myRouter.put('/user/create', bind(CreateUserValidator, "validate"), bind(myController, "createUser"));

  app.use('/admin', myRouter);
};
