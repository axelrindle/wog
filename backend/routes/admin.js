// Require modules
const AdminController = require('../controllers/AdminController');

module.exports = (app, myRouter) => {

  const { isAdmin } = app.get('middleware');
  const myController = new AdminController(app);

  myRouter.use(isAdmin);

  myRouter.get('/', myController.index.bind(myController));
  myRouter.post('/list/users', myController.listUsers.bind(myController));

  app.use('/admin', myRouter);
};
