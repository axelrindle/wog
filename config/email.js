// Require modules
const { env } = require('../backend/util');

/**
 * Define email settings.
 * @type {Object}
 */
module.exports = {

  /**
   * Transport options to authenticate against an SMTP server.
   * For a list of options see: https://nodemailer.com/smtp/
   */
  transport: {
    host: env('MAIL_HOST'),
    port: env('MAIL_PORT', 587),
    auth: {
      user: env('MAIL_USER', 'mail@localhost'),
      pass: env('MAIL_PASS')
    },

    /**
     * Whether to make use of connection pooling.
     * Read more: https://nodemailer.com/smtp/pooled/
     */
    pool: false
  },

  /**
   * Message options to apply to every email sent.
   * For a list of options see: https://nodemailer.com/message/
   */
  message: {
    from: env('MAIL_FROM', '"wog admin" <wog@localhost>')
  }

};
