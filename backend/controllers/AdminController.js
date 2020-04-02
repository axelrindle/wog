// Require modules
const Controller = require('./Controller');
const { getPath } = require('../util');

module.exports = class AdminController extends Controller {

  /**
   * Shows the administration page for admin users.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  index(req, res) {
    if (req.user.role === 'admin') {
      this.render(res, 'administration.html', {
        title: `${this.title} | administration`,
        user: req.user
      });
    } else {
      res.redirect(getPath());
    }
  }

  /**
   * Sends a list of all users.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  listUsers(req, res) {
    accounts.all()
      .then(result => res.json(result))
      .catch(err => {
        this.logger.error(err);
        res.status(500).json({ type: 'error', data: err.toString() });
      })
  }

};
