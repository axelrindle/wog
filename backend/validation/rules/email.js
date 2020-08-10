// Require modules
const ow = require('ow');
const emailValidator = require("email-validator");

/**
 * Validates an email address using the `email-validator` module.
 *
 * @param {string} value The email to validate.
 */
module.exports = ow.string.validate(value => ({
  validator: emailValidator.validate(value),
  message: label => `Expected ${label} to be a valid email address according to RFC-5322!`
}));
