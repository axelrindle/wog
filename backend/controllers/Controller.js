/**
 * A controller handles an incoming request.
 */
module.exports = class Controller {

  constructor(app) {
    this.app = app;
    this.init();
  }

  init() {
    // defaults no nothing :)
  }

};
