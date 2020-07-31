// Require modules
const { bind } = require('../util');
const ListController = require('../controllers/ListController');

module.exports = (app, myRouter) => {

  const { checkAuth } = app.get('middleware');
  const myController = new ListController(app);

  myRouter.use(checkAuth.is);

  myRouter.post('/adapters', bind(myController, "adapters"));
  myRouter.post('/groups', bind(myController, "groups"));
  myRouter.post('/entries', bind(myController, "entries"));

  app.use('/all', myRouter);

};
