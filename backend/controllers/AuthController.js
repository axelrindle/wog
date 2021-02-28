// Require modules
const Controller = require('./Controller');
const { url } = require('@wogjs/utils');

/**
 * The AuthController is responsible for authenticating users.
 */
module.exports = class AuthController extends Controller {

  init() {
    /** @type {import('passport').PassportStatic} */
    this.passport = this.app.get('passport');
  }

  login() {
    return this.passport.authenticate('local', {
      successRedirect: url(),
      failureRedirect: url(),
      failureFlash: 'Invalid username or password!'
    });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  logout(req, res) {
    req.logout();
    res.redirect( url() );
  }

};
