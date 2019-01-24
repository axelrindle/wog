/**
 * An array of globs for selecting log files to view in the interface.
 *
 * Note that the more files you include in your glob, the longer it will take for the
 * application to start.
 *
 * Read more here: https://www.npmjs.com/package/glob
 */
module.exports = [
  // included
  '/var/log/**',

  // excluded
  '!/var/log/**/*.*gz',
  '!/var/log/**/*.*xz',
  '!/var/log/**/*.*journal',
  '!/var/log/**/*.*journal~',
];
