// Require modules
const Validator = require('./Validator');
const rules = require('./rules/');

/**
 * Validates a request from a user to update his account details.
 */
class UpdateUserValidator extends Validator {

  shouldFlash() {
    return true;
  }

  rules() {
    return {
      id: [ rules.id ],
      email: [ rules.email ],
      password: [ rules.password ]
    };
  }

}

module.exports = {
  UpdateUserValidator
};
