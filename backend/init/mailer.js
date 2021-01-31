// Require modules
const nodemailer = require('nodemailer');
const stripHtml = require("string-strip-html");
const debug = require('debug')('wog:mailer');

module.exports = class Mailer {

  constructor({ config, logger }) {
    this.config = config.email;
    this.logger = logger;
  }

  async init() {
    this.logger = this.logger.scope('mailer');

    // create smtp transport
    const opts = this.config.transport;
    const merged = Object.assign(opts, {
      secure: opts.port === 465,
      debug: DEBUG
    });
    this.transport = nodemailer.createTransport(merged);

    // verify connection
    try {
      await this._verifyConnection();
      this.logger.info('Successfully connected to SMTP server.');
    } catch (error) {
      this.logger.error('Failed to create SMTP connection! ' + error.message);
      this.transport = null;
    }
  }

  _verifyConnection() {
    return new Promise((resolve, reject) => {
      this.transport.verify((err, success) => {
        if (err) reject(err);
        else resolve(success);
      })
    });
  }

  get isConnected() {
    return this.transport !== null;
  }

  /**
   * Attempts to send an email using the given options and the configuration.
   *
   * @param {string} to The receiver.
   * @param {string} subject The email subject.
   * @param {string} htmlText The formatted HTML text to send.
   * @returns {Promise}
   */
  async sendMail(to, subject, htmlText) {
    if (!this.isConnected) return Promise.reject("Not connected!");

    const text = stripHtml(htmlText);
    const opts = this.config.message;
    const merged = Object.assign(opts, {
      to, subject, text, htmlText
    });
    debug('Attempting to send a mail to "' + to + '"...')
    return this.transport.sendMail(merged);
  }

  dispose() {
    this.transport.close();
    this.logger.info('Disposed.');
    return Promise.resolve();
  }
}
