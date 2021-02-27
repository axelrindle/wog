// Require modules
const bindFn  = require('../utils/bind-fn');
const AdminController = require('../controllers/AdminController');
const { CreateUserValidator, UpdateUserValidator, DeleteUserValidator } = require('../validation/AdminValidators');

/**
 * @param {import('express').Application} app
 * @param {import('express-ws').Router} myRouter
 */
module.exports = (app, myRouter) => {

  const container = app.get('container');
  const { isAdmin } = app.get('middleware');
  const myController = new AdminController(app);

  myRouter.use(isAdmin);

  myRouter.get('/', bindFn(myController, "index"));

  myRouter.post('/user/list', bindFn(myController, "listUsers"));
  myRouter.put('/user/create', bindFn(new CreateUserValidator(container), "validate"), bindFn(myController, "createUser"));
  myRouter.patch('/user/edit', bindFn(new UpdateUserValidator(container), "validate"), bindFn(myController, "editUser"));
  myRouter.post('/user/delete', bindFn(new DeleteUserValidator(container), "validate"), bindFn(myController, "deleteUser"));

  myRouter.post('/config/list', bindFn(myController, "listConfig"));
  myRouter.post('/statistics/list', bindFn(myController, "listStatistics"));

  app.use('/admin', myRouter);
};
