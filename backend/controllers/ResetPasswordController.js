// Require modules
const Controller = require('./Controller');
const nanoid = require('nanoid/generate');
const { getPath, NANOID_ALPHABET } = require('../util');

/**
 * The ResetPasswordController is responsible for handling password reset requests and sending
 * the corresponding emails.
 */
module.exports = class ResetPasswordController extends Controller {

  init() {
    this.title = this.app.get('title');
    this.tokens = {}; // TODO: store tokens in redis
  }

  _flashError(req, msg) {
    req.flash('status', msg);
    req.flash('status-class', 'is-danger');
  }

  /**
   * Show the form for requesting a password reset.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  showRequestForm(req, res) {
    this.render(res, 'password-reset/request-form.html', {
      title: `${this.title} | reset password`
    });
  }

  /**
   * Handles an incoming password reset request.
   * The only required POST parameter is the user's email or username.
   * If a matching entry is found in the database, an email is sent to the found user.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  handleRequest(req, res) {
    const redirectPath = getPath('reset/password');
    req.flash('username', req.body.username);

    // do nothing when not connected to SMTP server
    if (!mailer.isConnected) {
      this._flashError(req, 'Application is not configured to send mails! Please contact your administrator.');
      res.redirect(redirectPath);
    }

    else {
      accounts.findByUsername(req.body.username)
        .then(user => {
          if (!user) {
            this._flashError(req, 'No matching user found!');
            res.redirect(redirectPath);
          }

          else if (!user.email) {
            this._flashError(req, 'The user has no email configured! Please contact your administrator.');
            res.redirect(redirectPath);
          }

          else if (Object.values(this.tokens).indexOf(user.id) !== -1) {
            this._flashError(req, 'A request for the given user is already pending!');
            res.redirect(redirectPath);
          }

          else {
            const token = nanoid(NANOID_ALPHABET, 32);
            this.tokens[token] = user.id;
            const url = redirectPath + '/' + token;
            mailer.sendMail(
              user.email, 'Password Reset Request',
              `
              <p>Password Reset Request</p>
              <a href="${url}">${url}</a>
              `
            )
              .then(info => {
                this.logger.info('Sent an email message to ' + user.email + '. (' + info.messageId + ')');
                req.flash('status', 'An email has been sent. Check your inbox.');
                req.flash('status-class', 'is-success');
              })
              .catch(err => {
                this.logger.error('Failed to send an email message! ' + err.message);
                if (DEBUG) console.error(err);
                this._flashError(req, err.message);
              })
              .then(() => {
                res.redirect(redirectPath);
              });
          }
        })
        .catch(err => {
          if (DEBUG) console.error(err);
          this._flashError(req, err.message);
          res.redirect(redirectPath);
        });
    }
  }

  /**
   * Show the form for actually resetting the password.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  showResetForm(req, res) {
    const token = req.params.token;

    if (!token || !this.tokens[token]) {
      res.redirect(getPath('reset/password'));
    }

    else {
      this.render(res, 'password-reset/reset-form.html', {
        title: `${this.title} | reset password`,
        token
      });
    }
  }

  /**
   * Handles a password reset.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  handleReset(req, res) {
    const token = req.params.token;
    const redirectPath = getPath('reset/password' + token);

    if (!token || !this.tokens[token]) {
      this._flashError(req, 'Invalid token!');
      res.redirect(redirectPath);
    }

    else {
      const password = req.body.password;
      const password_confirmed = req.body.password_confirm;

      if (!password || !password_confirmed) {
        this._flashError(req, 'Both fields must be filled!');
        res.redirect(redirectPath);
      }

      else if (password !== password_confirmed) {
        this._flashError(req, 'The passwords do no match!');
        res.redirect(redirectPath);
      }

      else {
        accounts.update({ password })
          .then(() => {
            req.flash('status', 'The password has been changed.');
            res.redirect(getPath());
          })
          .catch(err => {
            this.logger.error('Failed to reset a password! ' + err.message);
            if (DEBUG) console.error(err);
            this._flashError(req, err.message);
            res.redirect(redirectPath);
          });
      }
    }
  }
}
