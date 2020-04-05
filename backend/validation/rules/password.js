// Require modules
const ow = require('ow');
const PasswordValidator = require('password-validator');

const passwordSchema = new PasswordValidator()
  .is().min(8)
  .is().max(32)
  .has().letters()
  .has().digits();

/**
 * Validates a password against fixed rules.
 */
module.exports = ow.string.validate(value => {
  const failed = passwordSchema.validate(value, { list: true });
  return {
    validator: failed.length === 0,
    message: 'Password validation failed: ' + failed
  }
});
