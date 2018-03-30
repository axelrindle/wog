module.exports = {

  /** Whether to enable debug logs. */
  debug: false,

  /** The port the server is listening on. */
  port: 8082,

  url: '/',

  /**
   * An array of globs for selecting log files to view in the interface.
   *
   * Read more here: https://www.npmjs.com/package/glob
   */
  logs: [
    // included
    '/var/log/**/*.log*',

    // excluded
    '!/var/log/**/*.log*gz',
    '!/var/log/**/*.log*xz'
  ]

};
