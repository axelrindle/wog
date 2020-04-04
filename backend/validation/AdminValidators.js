// Require modules
const Validator = require('./Validator');
const { isSlug } = require('validator');
const customRules = require('./custom');

class CreateUserValidator extends Validator {

  rules() {
    return {
      username: [ isSlug, customRules.username ],
      password: [ customRules.password ],
      role: [ customRules.isIn(['user', 'admin']) ]
    };
  }

}

class UpdateUserValidator extends Validator {

  rules() {
    // make all optional, so only changed values are updated
    // TODO: Check for changes in the frontend? Or better in the backend?
    return {
      id: [ customRules.id, customRules.existsById ],
      username: [ 'optional', isSlug, customRules.username ],
      password: [ 'optional', customRules.password ],
      role: [ 'optional', customRules.isIn(['user', 'admin']) ]
    };
  }

}

class DeleteUserValidator extends Validator {

  rules() {
    return {
      id: [ customRules.id, customRules.existsById ]
    };
  }

}

// export an instance of each class
module.exports = {
  CreateUserValidator: new CreateUserValidator(),
  UpdateUserValidator: new UpdateUserValidator(),
  DeleteUserValidator: new DeleteUserValidator()
};
