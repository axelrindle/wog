// Require modules
const { bindFn } = require('@wogjs/utils');
const ListController = require('../controllers/ListController');

/**
 * @param {import('express').Application} app
 * @param {import('express-ws').Router} myRouter
 */
module.exports = (app, myRouter) => {

  const { checkAuth } = app.get('middleware');
  const myController = new ListController(app);

  myRouter.use(checkAuth.is);

  myRouter.post('/packages', bindFn(myController, "packagelist"));
  myRouter.post('/groups', bindFn(myController, "groups"));
  myRouter.post('/entries', bindFn(myController, "entries"));

  app.use('/all', myRouter);

};
