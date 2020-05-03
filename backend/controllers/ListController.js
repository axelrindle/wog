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
   * Sends a list of adapters.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  adapters(req, res) {
    res.json(adapters.list());
  }

  /**
   * Sends a list of groups for an adapter.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  groups(req, res) {
    const adapter = req.body.adapter;

    if (!adapter) {
      res.status(400).json({ type: 'error', data: 'No adapter selected!' });
      return;
    }

    res.json(adapters.getAdapter(adapter).getGroups());
  }

  /**
   * Sends a list of entries in a group of an adapter.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  entries(req, res) {
    const adapter = req.body.adapter;
    const group = req.body.group;

    if (!adapter) {
      res.status(400).json({ type: 'error', data: 'No adapter selected!' });
      return;
    }
    else if (!group) {
      res.status(400).json({ type: 'error', data: 'No group selected!' });
      return;
    }

    res.json(adapters.getAdapter(adapter).getEntries(group));
  }

};
