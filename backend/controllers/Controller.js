/**
 * A controller handles an incoming request.
 */
module.exports = class Controller {

  /**
   * Construct a new Controller instance.
   *
   * @param {import('express').Application} app
   */
  constructor(app) {
    this.app = app;

    /** @type {import('awilix').AwilixContainer} */
    this.container = app.get('container');

    /** @type {import('@wogjs/types').Logger} */
    this.logger = this.container.resolve('logger').scope(this.constructor.name);

    this.init();
  }

  init() {
    // defaults no nothing :)
  }

  /**
   * Render a template.
   *
   * @param {import('express').Response} res
   * @param {string} layout
   * @param {object} params
   */
  render(res, layout, params) {
    res.render(layout, params, (err, html) => {
      if (err) this.app.get('error handler')(err, null, res, null);
      else res.send(html);
    });
  }

};
