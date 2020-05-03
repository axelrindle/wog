// Require modules
const ListController = require('../controllers/ListController');

module.exports = (app, myRouter) => {

  const { checkAuth } = app.get('middleware');
  const myController = new ListController(app);

  myRouter.use(checkAuth.is);

  myRouter.post('/adapters', myController.adapters.bind(myController));
  myRouter.post('/groups', myController.groups.bind(myController));
  myRouter.post('/entries', myController.entries.bind(myController));

  app.use('/all', myRouter);

};
