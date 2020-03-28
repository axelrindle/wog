// Require modules
const ListController = require('../controllers/ListController');

module.exports = (app, router) => {

  const { checkAuthenticated } = app.get('middleware');
  const myController = new ListController(app);

  router.post('/objects', checkAuthenticated, myController.objects.bind(myController));
  router.post('/users', checkAuthenticated, myController.users.bind(myController));

};
