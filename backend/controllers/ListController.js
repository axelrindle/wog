// Require modules
const Controller = require('./Controller');

/**
 * The ListController sends lists of objects.
 */
module.exports = class ListController extends Controller {

  init() {
    this.logger = logger.scope('ListController');
  }

  /**
   * Sends a list of adapters or entries.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  objects(req, res) {
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
  }

  /**
   * Sends a list of all users.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  users(req, res) {
    accounts.all()
      .then(result => res.json(result))
      .catch(err => {
        this.logger.error(err);
        res.status(500).json({ type: 'error', data: err.toString() });
      })
  }

};
