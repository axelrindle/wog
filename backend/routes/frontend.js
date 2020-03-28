// Require modules
const FrontendController = require('../controllers/FrontendController');

module.exports = app => {

  const { checkAuthenticated } = app.get('middleware');
  const myController = new FrontendController(app);

  app.get('/', myController.index.bind(myController));
  app.get('/about', myController.about.bind(myController));

  if (DEBUG) {
    app.get('/admin', checkAuthenticated, myController.admin.bind(myController));
  }

};
