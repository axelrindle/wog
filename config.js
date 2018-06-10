module.exports = {

  /** The port the server is listening on. */
  port: 8082,

  url: '/',

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
    '/var/log/**/*.log*',

    // excluded
    '!/var/log/**/*.log*gz',
    '!/var/log/**/*.log*xz'
  ],

  /**
   * Whether to allow users to download log files to their computer.
   */
  enableFileDownloads: true

};
