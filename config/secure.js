/**
 * Secure settings (passwords, connection details, etc.)
 */
module.exports = {

  /** Redis connection settings. */
  redis: {
    host: 'localhost',
    port: 6379,
    pass: null,
    db: 0
  },

  /** A secret string used to encrypt session data. */
  secret: 'a-very-secret-value'

};
