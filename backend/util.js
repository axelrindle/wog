/**
 * Thrown to break out of a forEach loop.
 */
const BreakException = function () { /* no params ;) */ };

/**
 * Loop through the keys of an object.
 *
 * @param  {object}   obj      The object to loop through.
 * @param  {Function} callback A handler function. Takes one argument for the current key.
 */
exports.objectKeyLoop = (obj, callback) => {
  try {
    Object.keys(obj).forEach(callback);
  } catch (e) {
    if (e !== BreakException) throw e;
  }
};

/**
 * Logs an error message and immediately terminates the application.
 *
 * @param {string} err The error message.
 * @param {object} theLogger The signale instance to use.
 */
exports.fail = (err, theLogger = logger) => {
  theLogger.fatal(DEBUG ? err : err.message || err);
  process.exit(-1);
};

/**
 * The characters to use for nanoid/generate.
 *
 * @type {String}
 */
exports.NANOID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Get a value from the environment. If it is not set, return an
 * optional default value.
 *
 * @param  {string} key An environment variable.
 * @param  {any} _default An optional default value, if no value was found.
 * @return {any} The associated value, or undefined.
 */
exports.env = (key, _default) => {
  return process.env[key] || _default;
};

exports.getPath = path => {
  let url = config.app.url;
  if (!url.endsWith('/'))
    url += '/';

  if (path && path.startsWith('/'))
    path = path.substring(1);

  return path ? url + path : url;
};
