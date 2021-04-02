// Require modules
const { env } = require('@wogjs/utils');

module.exports = async () => {

  return {

    /**
     * Defines what adapters should be loaded.
     * @type {string}
     */
    enabled: env.text('ADAPTERS', 'file'),

    options: {

      file: {

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
};
