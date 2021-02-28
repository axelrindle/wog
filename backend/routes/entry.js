// Require modules
const { bindFn } = require('@wogjs/utils');
const EntryController = require('../controllers/EntryController');

/**
 * @param {import('express').Application} app
 * @param {import('express-ws').Router} myRouter
 */
module.exports = (app, myRouter) => {

  const { checkAuth, requireParameters } = app.get('middleware');
  const middleware = [checkAuth.is, requireParameters(['adapter', 'id'])];
  const myController = new EntryController(app);

  myRouter.post('/contents', middleware, bindFn(myController, "contents"));
  myRouter.get('/download/:adapter/:id', middleware, bindFn(myController, "download"));

  app.use('/entry', myRouter);

};
