module.exports = {

  /** The port the server is listening on. */
  port: 8082,

  /** The full root url for the application. */
  url: 'http://localhost:8082/',

  /**
   * An array of globs for selecting log files to view in the interface.
   *
   * Note that the more files you include in your glob, the longer it will take for the
   * application to start.
   *
   * Read more here: https://www.npmjs.com/package/glob
   */
  logs: [
    // included
    '/var/log/**',

    // excluded
    '!/var/log/**/*.*gz',
    '!/var/log/**/*.*xz',
    '!/var/log/**/*.*journal',
    '!/var/log/**/*.*journal~'
  ],

  /**
   * Whether to allow users to download log files to their computer.
   */
  enableFileDownloads: true,

  /** Session settings. */
  session: {

    /** Redis connection settings. */
    redis: {
      host: 'localhost',
      port: 6379,
      pass: null,
      db: 0
    },

    /** A secret string used to encrypt session data. */
    secret: 'G0uiM2qogaC42lOMqiw3'
  }

};
