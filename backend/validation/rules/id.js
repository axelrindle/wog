// Require modules
const ow = require('ow');

/**
 * Checks whether a user with the given ID does not exist.
 */
const existsById = value => {
  return new Promise((resolve, reject) => {
    accounts.findById(value)
    .then(user => {
      if (!user) {
        reject(`No user found with ID ${value}!`);
      } else {
        resolve();
      }
    });
  });
};

module.exports = [
  ow.number.integer.positive,
  existsById
];
