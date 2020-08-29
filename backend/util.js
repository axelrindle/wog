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
 * Retrieve a value from the environment.
 */
exports.env = {

  /**
   * Generic retriever for environment variables.
   *
   * @param {string} key The environment key to retrieve.
   * @param {any} def A default value.
   * @param {Function} validate A validation function that consumes the raw value from the environment.
   * @returns {string|any|undefined} The retrieved value, the default value or `undefined` (in this order).
   */
  _get(key, def, validate) {
    const value = process.env[key];
    return validate(value) ? value : def;
  },

  /**
   * Retrieves a text value from the environment.
   *
   * @param {string} key The environment key to retrieve.
   * @param {any} def A default value.
   * @returns {string|any|undefined} The retrieved value, the default value or `undefined` (in this order).
   */
  text(key, def = undefined) {
    return this._get(key, def, value => typeof value === 'string');
  },

  /**
   * Retrieves an int value from the environment.
   *
   * @param {string} key The environment key to retrieve.
   * @param {any} def A default value.
   * @returns {Number|any|undefined} The retrieved value, the default value or `undefined` (in this order).
   */
  int(key, def = undefined) {
    return this._get(key, def, value => parseInt(value));
  },

  /**
   * Retrieves a boolean value from the environment.
   *
   * @param {string} key The environment key to retrieve.
   * @param {any} def A default value.
   * @returns {boolean|any|undefined} The retrieved value, the default value or `undefined` (in this order).
   */
  bool(key, def = undefined) {
    const result = this._get(key, def, value => {
      if (!value) return false;
      else return [ 'true', 'false' ].includes( value.toLowerCase() );
    });
    return result ? (result === 'true') : def;
  }
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
