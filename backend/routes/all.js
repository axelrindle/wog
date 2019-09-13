// Require modules
const accounts = require('../app/accounts');

module.exports = (app, router) => {

  // get middleware
  const { checkAuthenticated } = app.get('middleware');

  // sends a list of all adapters/entries
  router.post('/objects', checkAuthenticated, (req, res) => {
    const type = req.body.type;
    switch (type) {
      case 'adapters':
        res.json(adapters.list());
        break;
      case 'entries': {
        const selectedAdapter = req.body.adapter;
        if (!selectedAdapter) {
          res.status(400).json({ type: 'error', data: 'No adapter selected!' });
        } else {
          res.json(adapters.getAdapter(selectedAdapter).entries);
        }
        break;
      }
      default:
        res.status(400).json({ type: 'error', data: `Unknown type ${type}!` });
        break;
    }
  });

  // sends a list of all users
  router.post('/users', checkAuthenticated, (req, res) => {
    res.json(accounts.all());
  });
};
