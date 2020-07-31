/**
 * Logs an error message and immediately terminates the application.
 *
 * @param {string} err The error message.
 */
exports.fail = err => {
  console.error(DEBUG ? err : err.message || err);
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
exports.env = (key, _default = undefined) => {
  return process.env[key] || _default;
};

/**
 * Formats an url path relative to the configured application url.
 *
 * @param {string} path The relative path component.
 * @returns {string} The absolute url.
 */
exports.getPath = path => {
  let url = config.app.url;
  if (!url.endsWith('/'))
    url += '/';

  if (path && path.startsWith('/'))
    path = path.substring(1);

  return path ? url + path : url;
};

/**
 * Tests whether an object is empty.
 *
 * @param {Object} obj
 * @returns {boolean} Whether the object is empty.
 */
exports.isEmptyObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

/**
 * Shortcut for binding a function to it's parent object. Useful for use with classes.
 *
 * @param {Object} obj The object to bind to.
 * @param {String} func The name of the function to bind.
 */
exports.bind = (obj, func) => obj[func].bind(obj);
