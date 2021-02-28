// Require modules
const nodemailer = require('nodemailer');
const stripHtml = require("string-strip-html");
const debug = require('debug')('wog:mailer');
const { isDebug } = require('@wogjs/utils');

/** @type {import('@wogjs/types').Mailer} */
module.exports = class Mailer {

  constructor({ config, logger }) {
    this._config = config.email;
    this._logger = logger.scope('mailer');
  }

  async init() {
    // create smtp transport
    const opts = this._config.transport;
    const merged = Object.assign(opts, {
      secure: opts.port === 465,
      debug: isDebug
    });
    this.transport = nodemailer.createTransport(merged);

    // verify connection
    try {
      await this._verifyConnection();
      this._logger.info('Successfully connected to SMTP server.');
    } catch (error) {
      this._logger.error('Failed to create SMTP connection! ' + error.message);
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

  async sendMail(to, subject, htmlText) {
    if (!this.isConnected) return Promise.reject("Not connected!");

    const text = stripHtml(htmlText);
    const opts = this._config.message;
    const merged = Object.assign(opts, {
      to, subject, text, htmlText
    });
    debug('Attempting to send a mail to "' + to + '"...')
    return this.transport.sendMail(merged);
  }

  dispose() {
    this.transport.close();
    this._logger.info('Disposed.');
    return Promise.resolve();
  }
}
