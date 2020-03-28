// Require modules
const EntryController = require('../controllers/EntryController');

module.exports = (app, router) => {

  const { checkAuthenticated, requireParameters } = app.get('middleware');
  const middleware = [checkAuthenticated, requireParameters(['adapter', 'id'])];
  const myController = new EntryController(app);

  router.post('/contents', middleware, myController.contents.bind(myController));
  router.get('/download/:adapter/:id', middleware, myController.download.bind(myController));

};
