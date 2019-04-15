/**
 * Secure settings (passwords, connection details, etc.)
 */
module.exports = {

  /** Redis connection settings. */
  redis: {
    host: env('REDIS_HOST'),
    port: env('REDIS_PORT', 6379),
    pass: env('REDIS_PASS'),
    db: env('REDIS_DB', 0)
  },

  /** A secret string used to encrypt session data. */
  secret: env('APP_KEY')

};
