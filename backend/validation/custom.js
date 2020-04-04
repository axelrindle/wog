// Require modules
const { isIn, isNumeric } = require('validator');
const PasswordValidator = require('password-validator');

const passwordSchema = new PasswordValidator()
  .is().min(8)
  .is().max(32)
  .has().letters()
  .has().digits();

/**
 * Checks that the given value is an ID number (positive, starting from zero).
 */
module.exports.id = value => isNumeric(value, { no_symbols: true });

/**
 * Checks that the given username does not exist.
 */
module.exports.username = (value, cb) => {
  accounts.findByUsername(value)
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

/**
 * Checks whether a user with the given ID does not exist.
 */
module.exports.existsById = (value, cb) => {
  accounts.findById(value)
    .then(user => {
      if (!user) {
        cb(`No user found with ID ${value}!`);
      } else {
        cb(null);
      }
    });
};
