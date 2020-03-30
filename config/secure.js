// Require modules
const { env } = require('../backend/util');

/**
 * Secure settings (passwords, connection details, etc.)
 */
module.exports = {

  /** Redis connection settings. */
  redis: {
    host: env('REDIS_HOST'),
    port: parseInt(env('REDIS_PORT', 6379)),
    pass: env('REDIS_PASS'),
    db: parseInt(env('REDIS_DB', 0))
  },

  /** A secret string used to encrypt session data. */
  secret: env('APP_KEY'),

  /**
   * Options for session cookies.
   * See https://www.npmjs.com/package/express-session#cookie
   */
  cookie: {

    /** Defines the maximum age of cookies. Defaults to 24 hours. */
    maxAge: env('APP_COOKIE_MAX_AGE', 1000 * 60 * 60 * 24)
  }

};
