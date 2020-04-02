// Require modules
const ListController = require('../controllers/ListController');

module.exports = (app, myRouter) => {

  const { checkAuthenticated } = app.get('middleware');
  const myController = new ListController(app);

  myRouter.post('/objects', checkAuthenticated, myController.objects.bind(myController));
  myRouter.post('/users', checkAuthenticated, myController.users.bind(myController));

  app.use('/all', myRouter);

};
