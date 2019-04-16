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
    files: '@adapter/FileAdapter.js'
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
    }

  }

};
