// Require modules
const AdminController = require('../controllers/AdminController');
const { CreateUserValidator } = require('../validation/AdminValidators');

module.exports = (app, myRouter) => {

  const { isAdmin } = app.get('middleware');
  const myController = new AdminController(app);

  myRouter.use(isAdmin);

  myRouter.get('/', myController.index.bind(myController));
  myRouter.post('/user/list', myController.listUsers.bind(myController));
  myRouter.put('/user/create', CreateUserValidator.validate.bind(CreateUserValidator), myController.createUser.bind(myController));

  app.use('/admin', myRouter);
};
