// Require modules
const isDebug = require('./is-debug');

/**
 * Logs an error message and immediately terminates the application.
 *
 * @param {string|Error} err The error message.
 * @param {number} code The exit code. 
 */
module.exports = (err, code = -1) => {
    console.error(isDebug() ? err : err.message || err);
    process.exit(code);
};
