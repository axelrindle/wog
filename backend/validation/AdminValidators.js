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

// export an instance of each class
module.exports = {
  CreateUserValidator: new CreateUserValidator()
};
