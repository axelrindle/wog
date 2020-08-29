// Require modules
const { env } = require('../backend/util');

/**
 * Define active adapters.
 * @type {Object}
 */
module.exports = {

  /**
   * Defines what adapters should be loaded.
   * @type {string}
   */
  enabled: env.text('ADAPTERS', 'file'),

  options: {

    file: {
      /**
       * An array of globs for selecting log files to view in the interface.
       *
       * Note that the more files you include in your glob,
       * the longer it will take to load them.
       *
       * Read more here: https://www.npmjs.com/package/glob
       */
      groups: {
        'Apache': [
          '/var/log/apache2/*.log'
        ],
        'Samba': [
          '/var/log/samba/log.*',
          '!/var/log/samba/log.*.gz'
        ],
        'Syslogs': [
          '/var/log/*.log',
          '/var/log/*log',
          '!/var/log/*gz'
        ],
        'Test': [
          '/home/axel/opt/test.txt'
        ]
      }
    },

    redis: {
      connection: {
        host: env.text('ADAPTER_REDIS_HOST', env.text('REDIS_HOST')),
        port: env.int('ADAPTER_REDIS_PORT', env.int('REDIS_PORT', 6379)),
        password: env.text('ADAPTER_REDIS_PASS', env.text('REDIS_PASS'))
      },
      keys: env.text('ADAPTER_REDIS_KEYS')
    }

  }

};
