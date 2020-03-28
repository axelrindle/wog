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
    this.init();
  }

  init() {
    // defaults no nothing :)
  }

};
