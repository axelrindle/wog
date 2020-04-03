// Require modules
const { isIn } = require('validator');
const PasswordValidator = require('password-validator');

const passwordSchema = new PasswordValidator()
  .is().min(8)
  .is().max(32)
  .has().letters()
  .has().digits();

/**
 * Checks that the given username does not exist.
 */
module.exports.username = (value, cb) => {
  return accounts.findByUsername(value)
    .then(user => {
      if (user) {
        cb('Username already in use!');
      } else {
        cb(null);
      }
    });
};

/**
 * Validates a password against fixed rules.
 */
module.exports.password = value => {
  const failed = passwordSchema.validate(value, { list: true });
  if (failed.length > 0) {
    return 'Password validation failed: ' + failed;
  }
};

module.exports.isIn = values => {
  return value => {
    if (!isIn(value, values)) {
      return `Value '${value} is not allowed!'`;
    }
  };
};
