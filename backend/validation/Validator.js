// Require modules
const { isEmptyObject } = require('../util');
const owWrapper = require('./ow-wrapper');
const { ArgumentError } = require('ow');

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
      const wrapped = owWrapper(functions);
      const value = req.body[property];
      try {
        await wrapped(value);
      } catch (error) {
        if (typeof error === 'string') {
          errors[property] = error;
        }
        else if (error instanceof ArgumentError) {
          errors[property] = error.message;
        }
      }
    }

    // check for errors
    if (!isEmptyObject(errors)) {
      this.myLogger.debug('Validation errors: ' + JSON.stringify(errors));
      res.status(422).json({ errors });
    } else {
      next();
    }
  }
}
