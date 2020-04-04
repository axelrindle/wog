// Require modules
const Controller = require('./Controller');
const { getPath } = require('../util');

module.exports = class AdminController extends Controller {

  init() {
    this.title = this.app.get('title');
  }

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

  /**
   * Creates a new user.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  createUser(req, res) {
    accounts.create(req.body)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }

  /**
   * Updates an existing user.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  editUser(req, res) {
    accounts.update(req.body)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }

};
