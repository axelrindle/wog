// Require modules
const { isEmptyObject } = require('../util');
const asyncForEach = require('@axelrindle/async-for-each');

/**
 * The Validator is responsible for validating data from requests.
 */
module.exports = class Validator {

  constructor() {
    this.myLogger = logger.scope('validation');
  }

  /**
   * Define the rules for this validator.
   *
   * @returns {Array} An array of validator functions.
   */
  rules() {
    throw new Error('rules() must be implemented by child classes!');
  }

  /**
   * Validate a request based on the given rules.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   */
  async validate(req, res, next) {
    const body = req.body;
    const rules = this.rules();
    const errors = {};

    // validate each defined property rule
    for (let property in rules) {
      const optional = rules[property].indexOf('optional') !== -1;

      // check for existence if not optional
      if (!optional && !body[property]) {
        errors[property] = `Missing required property ${property}!`;
        continue;
      }
      else if (optional && !body[property]) {
        continue;
      }

      // run each validation function and pass the value from the request
      const functions = rules[property].filter(el => el !== 'optional');
      for (let func of functions) {
        const value = req.body[property];

        try {
          const result = await this._runValidatorFunction(func, value);

          // attach error message if given
          if (typeof result === 'string') {
            errors[property] = result;
            break;
          }
        } catch(err) {
          this.myLogger.error(err);
        }
      }
    }

    // check for errors
    this.myLogger.debug('Validation errors: ' + JSON.stringify(errors));
    if (!isEmptyObject(errors)) {
      res.status(422).json({ errors });
    } else {
      next();
    }
  }

  _runValidatorFunction(func, value) {
    return new Promise((resolve, reject) => {
      switch (func.length) {
        case 1: // sync
          resolve(func(value));
          break;
        case 2: // async
          func(value, resolve);
          break;
        default: // illegal
          this.myLogger.debug(`A validator function ('${func.name}') of property ${property} is invalid!`);
          reject(`Validator function must have only 1 or 2 parameters!`);
          break;
      }
    });
  }
}
