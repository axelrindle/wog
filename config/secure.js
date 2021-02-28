// Require modules
const { env } = require('@wogjs/utils');

/**
 * Secure settings (passwords, connection details, etc.)
 */
module.exports = container => {
  return {

    /**
     * Redis connection settings.
     * See https://github.com/NodeRedis/node-redis#options-object-properties
     */
    redis: {
      host: env.text('REDIS_HOST'),
      port: env.int('REDIS_PORT', 6379),
      password: env.text('REDIS_PASS'),
      db: env.int('REDIS_DB', 0),
      prefix: 'wog:'
    },

    /** A secret string used to encrypt session data. */
    secret: env.text('APP_KEY'),

    /**
     * Options for session cookies.
     * See https://www.npmjs.com/package/express-session#cookie
     */
    cookie: {

      /** Defines the maximum age of cookies. Defaults to 24 hours. */
      maxAge: env.int('APP_COOKIE_MAX_AGE', 1000 * 60 * 60 * 24)
    },

    /**
     * Specifies the lifetime (in seconds) of the tokens used to reset passwords.
     * Defaults to one hour.
     */
    resetTokenLifetime: env.int('APP_TOKEN_AGE', 60 * 60)

  };
};
