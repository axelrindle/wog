// Require modules
const Controller = require('./Controller');
const getPath = require('../utils/paths');

/**
 * The AuthController is responsible for authenticating users.
 */
module.exports = class AuthController extends Controller {

  init() {
    this.passport = this.app.get('passport');
  }

  login() {
    return this.passport.authenticate('local', {
      successRedirect: getPath(),
      failureRedirect: getPath(),
      failureFlash: 'Invalid username or password!'
    });
  }

  logout(req, res) {
    req.logout();
    res.redirect(getPath());
  }

};
