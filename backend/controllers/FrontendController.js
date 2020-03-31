// Require modules
const Controller = require('./Controller');
const { getPath } = require('../util');

/**
 * The FrontendController is responsible for rendering the HTML pages.
 */
module.exports = class FrontendController extends Controller {

  init() {
    this.title = this.app.get('title');
    this.version = this.app.get('version');
  }

  /**
   * Builds the URL for the Websocket connection.
   *
   * @param {Express.Request} req
   */
  getWebsocketUrl(req) {
    return config.app.isProxy ?
      `${req.protocol.replace('http', 'ws')}://${req.hostname.split(':')[0]}:${config.app.socketPort}` :
      `${config.app.url}${config.app.url.endsWith('/') ? '' : '/'}socket`;
  }

  /**
   * Shows the log interface. If the user is not authenticated, the login page is shown instead.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  index(req, res) {
    if (req.isAuthenticated()) {
      this.render(res, 'overview.html', {
        title: `${this.title} | overview`,
        user: req.user,
        wsUrl: this.getWebsocketUrl(req)
      });
    } else {
      this.render(res, 'login.html', {
        title: `${this.title} | login`,
        error: req.flash('error')
      });
    }
  }

  /**
   * Shows the administration page for admin users.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  admin(req, res) {
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
   * Shows the about page.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  about(req, res) {
    this.render(res, 'about.html', {
      title: `${this.title} | about`,
      version: this.version
    });
  }

};
