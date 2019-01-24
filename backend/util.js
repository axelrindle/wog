/**
 * Thrown to break out of a forEach loop.
 */
global.BreakException = function () { /* no params ;) */ };

/**
 * Loop through the keys of an object.
 *
 * @param  {object}   obj      The object to loop through.
 * @param  {Function} callback A handler function. Takes one argument for the current key.
 */
global.objectKeyLoop = (obj, callback) => {
  try {
    Object.keys(obj).forEach(callback);
  } catch (e) {
    if (e !== BreakException) throw e;
  }
};

/**
 * Logs an error message and immediately terminates the application.
 *
 * @param  {string} err The error message.
 */
global.fail = (err) => {
  logger.fatal(err);
  process.exit(-1);
};

/**
 * The characters to use for nanoid/generate.
 *
 * @type {String}
 */
global.NANOID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
