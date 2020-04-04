// Require modules
const { bind } = require('../util');
const AdminController = require('../controllers/AdminController');
const { CreateUserValidator, UpdateUserValidator, DeleteUserValidator } = require('../validation/AdminValidators');

module.exports = (app, myRouter) => {

  const { isAdmin } = app.get('middleware');
  const myController = new AdminController(app);

  myRouter.use(isAdmin);

  myRouter.get('/', bind(myController, "index"));
  myRouter.post('/user/list', bind(myController, "listUsers"));
  myRouter.put('/user/create', bind(CreateUserValidator, "validate"), bind(myController, "createUser"));
  myRouter.patch('/user/edit', bind(UpdateUserValidator, "validate"), bind(myController, "editUser"));
  myRouter.post('/user/delete', bind(DeleteUserValidator, "validate"), bind(myController, "deleteUser"));

  app.use('/admin', myRouter);
};
