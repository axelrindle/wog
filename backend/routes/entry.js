// Require modules
const { bind } = require('../util');
const EntryController = require('../controllers/EntryController');

module.exports = (app, myRouter) => {

  const { checkAuth, requireParameters } = app.get('middleware');
  const middleware = [checkAuth.is, requireParameters(['adapter', 'id'])];
  const myController = new EntryController(app);

  myRouter.post('/contents', middleware, bind(myController, "contents"));
  myRouter.get('/download/:adapter/:id', middleware, bind(myController, "download"));

  app.use('/entry', myRouter);

};
