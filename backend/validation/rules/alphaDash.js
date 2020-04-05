// Require modules
const ow = require('ow');

/**
 * Test whether the given value contains only alpha-numeric characters, dashes, underscores and dots.
 * The value must start and end with alpha-numeric characters.
 *
 * @param {number} minLength The minimum value length.
 * @returns {object} An ow predicate.
 */
module.exports = (minLength = 8) => {
  return ow.string.validate(value => ({
    validator: new RegExp(`^[a-zA-Z0-9]+[a-zA-Z0-9\\.\\-\\_]{${minLength - 2},}[a-zA-Z0-9]+$`, 'g').test(value),
    message: label => `Expected ${label} to only contain alpha-numeric characters, dashes, underscores and dots!`
  }))
};
