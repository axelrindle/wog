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
    host: env.text('MAIL_HOST'),
    port: env.int('MAIL_PORT', 587),
    auth: {
      user: env.text('MAIL_USER', 'mail@localhost'),
      pass: env.text('MAIL_PASS')
    },

    /**
     * Whether to make use of connection pooling.
     * Read more: https://nodemailer.com/smtp/pooled/
     */
    pool: false,

    /**
     * How many milliseconds to wait for the connection to establish.
     * Should be generally as low as possible, as connecting blocks the
     * startup process.
     *
     * Read more: https://nodemailer.com/smtp/#connection-options
     */
    connectionTimeout: 1000 * 10 // (10 seconds)
  },

  /**
   * Message options to apply to every email sent.
   * For a list of options see: https://nodemailer.com/message/
   */
  message: {
    from: env.text('MAIL_FROM', '"wog admin" <wog@localhost>')
  }

};
