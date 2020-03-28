// Load accounts file
const accounts = require('@root/accounts');

const clone = el => {
  let clone = Object.assign({}, el);
  delete clone.pass;
  return clone;
};

// Export utility functions

/**
 * An array of all accounts without sensitive data.
 */
const all = module.exports.all = accounts.map(clone);

/**
 * Find the matching user account.
 *
 * @param {String} name The username to search.
 * @returns {(Object|undefined)} the account object with the given name, or `null`.
 */
const find = module.exports.find = name => {
  const account = all.find(el => el.name === name);
  return account ? account : undefined;
};

/**
 * Check whether an account with the given username exists.
 *
 * @param {String} name
 * @returns {boolean}
 */
const has = module.exports.has = name => find(name) !== undefined;

/**
 * Check whether a given username/password combination is valid to authenticate.
 *
 * @param {string} name The username.
 * @param {string} pass The password.
 * @returns {boolean} Whether the authentication was successful.
 */
module.exports.checkAuth = (name, pass) => {
  let success = has(name) && find(name).pass === pass;
  console.log(`${name} + ${pass} => ${success}`);
  return success;
}
