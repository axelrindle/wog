/**
 * A controller handles an incoming request.
 */
module.exports = class Controller {

  /**
   * Construct a new Controller instance.
   *
   * @param {Express.Application} app
   */
  constructor(app) {
    this.app = app;
    this.container = app.get('container');

    this.logger = this.container.resolve('logger').scope(this.constructor.name);
    this.init();
  }

  init() {
    // defaults no nothing :)
  }

  /**
   * Render a template.
   *
   * @param {Express.Response} res
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
