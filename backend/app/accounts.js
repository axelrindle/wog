// Load accounts file
const accounts = require('@root/accounts');

const clone = el => {
  let clone = Object.assign({}, el);
  delete clone.pass;
  return clone;
};

/**
 * Export utility functions.
 */
module.exports = {
  all() {
    return accounts.map(clone);
  },
  find(name) {
    const account = accounts.find(el => el.name === name);
    return account ? clone(account) : undefined;
  },
  has(name) {
    return this.find(name) !== undefined;
  },
  checkAuth(name, pass) {
    return this.has(name) && this.find(name).pass === pass;
  }
};
