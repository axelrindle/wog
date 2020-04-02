// Require modules
const ListController = require('../controllers/ListController');

module.exports = (app, myRouter) => {

  const { checkAuth } = app.get('middleware');
  const myController = new ListController(app);

  myRouter.use(checkAuth.is);

  myRouter.post('/objects', myController.objects.bind(myController));

  app.use('/all', myRouter);

};
