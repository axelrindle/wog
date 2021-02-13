// Require modules
const bindFn = require('../utils/bind-fn');
const ListController = require('../controllers/ListController');

module.exports = (app, myRouter) => {

  const { checkAuth } = app.get('middleware');
  const myController = new ListController(app);

  myRouter.use(checkAuth.is);

  myRouter.post('/packages', bindFn(myController, "packagelist"));
  myRouter.post('/groups', bindFn(myController, "groups"));
  myRouter.post('/entries', bindFn(myController, "entries"));

  app.use('/all', myRouter);

};
