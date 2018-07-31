// Require modules
const path = require('path');

/**
 * Transforms a path to show the filename and the parent directory.
 */
module.exports.transformFilePath = file => {
  const parent = path.basename(path.dirname(file));
  const base = path.basename(file);
  return path.join(parent, base);
};

/**
 * A sorting functions which compares the first char of two strings.
 */
module.exports.fileSorter = (a, b) => {
  a = a.path.charAt(0);
  b = b.path.charAt(0);
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};
