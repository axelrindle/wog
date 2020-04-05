/**
 * Checks that the given username does not exist.
 */
module.exports = value => {
  return new Promise((resolve, reject) => {
    accounts.findByUsername(value)
      .then(user => {
        if (user) {
          reject('Username already in use!');
        } else {
          resolve();
        }
      });
  });
};
