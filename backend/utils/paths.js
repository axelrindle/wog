// Require modules
const env = require('./env');

/**
 * Formats the application url with any given relative paths.
 *
 * @param {string} path
 */
module.exports = path => new URL(path || "", env.text('APP_URL')).toString();
