// Require modules
const Validator = require('./Validator');
const rules = require('./rules/');

/**
 * Validates request for creating users.
 */
class CreateUserValidator extends Validator {

  rules() {
    return {
      username: [ rules.usernameExistsNot, rules.alphaDash(4) ],
      email: [ rules.email ],
      password: [ rules.password ],
      role: [ rules.role ]
    };
  }

}

/**
 * Validates request for updating users.
 */
class UpdateUserValidator extends Validator {

  rules() {
    return {
      id: rules.id,
      username: [ 'optional', rules.usernameExistsNot ],
      password: [ 'optional', rules.password ],
      role: [ 'optional', rules.role ]
    };
  }

}

/**
 * Validates request for deleting users.
 */
class DeleteUserValidator extends Validator {

  rules() {
    return {
      id: rules.id
    };
  }

}

// export an instance of each class
module.exports = {
  CreateUserValidator: new CreateUserValidator(),
  UpdateUserValidator: new UpdateUserValidator(),
  DeleteUserValidator: new DeleteUserValidator()
};
