// Require modules
const { env } = require('../backend/util');

/**
 * Define active adapters.
 * @type {Object}
 */
module.exports = {

  /**
   * Defines available adapters.
   * @type {Object}
   */
  available: {
    files: '@adapter/FileAdapter.js',
    redis: '@adapter/RedisAdapter.js'
  },

  /**
   * Defines what adapters should be loaded.
   * @type {string}
   */
  enabled: env('ADAPTERS', 'files'),

  options: {

    files: {
      /**
       * An array of globs for selecting log files to view in the interface.
       *
       * Note that the more files you include in your glob,
       * the longer it will take to load them.
       *
       * Read more here: https://www.npmjs.com/package/glob
       */
      glob: [
        // included
        '/var/log/**',

        // excluded
        '!/var/log/**/*.*gz',
        '!/var/log/**/*.*xz',
        '!/var/log/**/*.*journal',
        '!/var/log/**/*.*journal~',
      ]
    },

    redis: {
      connection: {
        host: env('ADAPTER_REDIS_HOST', env('REDIS_HOST')),
        port: env('ADAPTER_REDIS_PORT', env('REDIS_PORT', 6379)),
        password: env('ADAPTER_REDIS_PASS', env('REDIS_PASS'))
      },
      keys: env('ADAPTER_REDIS_KEYS')
    }

  }

};
