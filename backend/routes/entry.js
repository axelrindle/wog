// Require modules
const EntryController = require('../controllers/EntryController');

module.exports = (app, myRouter) => {

  const { checkAuth, requireParameters } = app.get('middleware');
  const middleware = [checkAuth.is, requireParameters(['adapter', 'id'])];
  const myController = new EntryController(app);

  myRouter.post('/contents', middleware, myController.contents.bind(myController));
  myRouter.get('/download/:adapter/:id', middleware, myController.download.bind(myController));

  app.use('/entry', myRouter);

};
