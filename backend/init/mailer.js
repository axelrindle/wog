// Require modules
const nodemailer = require('nodemailer');
const stripHtml = require("string-strip-html");

class Mailer {

  async init() {
    this.logger = logger.scope('mailer');

    // create smtp transport
    const opts = config.email.transport;
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
    const opts = config.email.message;
    const merged = Object.assign(opts, {
      to, subject, text, htmlText
    });
    return this.transport.sendMail(merged);
  }

  dispose() {
    this.transport.close();
    this.logger.info('Disposed.');
    return Promise.resolve();
  }
}

module.exports = new Mailer();
