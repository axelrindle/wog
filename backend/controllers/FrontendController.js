// Require modules
const Controller = require('./Controller');
const debug = require('debug')('wog:FrontendController');
const { isDebug } = require('@wogjs/utils');

/**
 * The FrontendController is responsible for rendering the HTML pages.
 */
module.exports = class FrontendController extends Controller {

  init() {
    const { name, description, version } = require('@wog/root/package.json');

    this.pkg = { name, description, version };
    this.config = this.container.resolve('config');

    /** @type {import('@wogjs/types').RedisManager} */
    this.redis = this.container.resolve('redis');

    /** @type {string} */
    this.title = this.app.get('title');
  }

  /**
   * Builds the URL for the Websocket connection.
   *
   * @param {import('express').Request} req
   */
  getWebsocketUrl(req) {
    return this.config.app.isProxy ?
      `${req.protocol.replace('http', 'ws')}://${req.hostname.split(':')[0]}:${this.config.app.socketPort}` :
      `${this.config.app.url}${this.config.app.url.endsWith('/') ? '' : '/'}socket`;
  }

  /**
   * Shows the log interface.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
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
   * @param {import('express').Request} req
   * @param {import('express').Response} res
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
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async about(req, res) {
    // handle cache deletion request
    if (isDebug && req.query.fresh) {
      await new Promise((resolve, reject) => {
        this.redis.client.del('dependencies', (err, reply) => {
          debug('redis replied: ' + reply);
          if (err) reject(err);
          else resolve();
        })
      });
    }

    // load dependencies from cache
    let dependenciesCached = await new Promise((resolve, reject) => {
      this.redis.client.get('dependencies', (err, reply) => {
        debug('redis replied: ' + reply);
        if (err) reject(err);
        else resolve(JSON.parse(reply));
      })
    });

    // cache entry not found, resolve dependencies and write them to the cache
    if (!dependenciesCached) {
      dependenciesCached = Object.keys(require('@wog/root/package.json').dependencies);
      await new Promise((resolve, reject) => {
        this.redis.client.set('dependencies', JSON.stringify(dependenciesCached), (err, reply) => {
          debug('redis replied: ' + reply);
          if (err) reject(err);
          else resolve();
        })
      });
    }

    debug(dependenciesCached);

    this.render(res, 'about.html', {
      user: req.user,
      title: `${this.title} | about`,
      dependencies: dependenciesCached,
      pkg: this.pkg
    });
  }

};
