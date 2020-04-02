// Require modules
const Controller = require('./Controller');

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
   * Shows the log interface.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  index(req, res) {
    this.render(res, 'overview.html', {
      title: `${this.title} | overview`,
      user: req.user,
      wsUrl: this.getWebsocketUrl(req)
    });
  }

  /**
   * Show the login form.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  login(req, res) {
    this.render(res, 'login.html', {
      title: `${this.title} | login`,
      error: req.flash('error')
    });
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
