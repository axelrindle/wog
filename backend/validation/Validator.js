// Require modules
const owWrapper = require('./ow-wrapper');
const { ArgumentError } = require('ow');
const debug = require('debug')('wog:Validator');

/**
 * The Validator is responsible for validating data from requests.
 */
module.exports = class Validator {

  constructor(container) {
    this.myLogger = container.resolve('logger').scope('validation');
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
   * Indicates whether any errors should be flashed to the session.
   *
   * @returns {boolean}
   */
  shouldFlash() {
    return false;
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
    let errored = false;

    // validate each defined property rule
    for (let property in rules) {
      const pushError = msg => {
        errored = true;
        req.flash('errors.' + property, msg);
      };

      const optional = rules[property].indexOf('optional') !== -1;

      // check for existence if not optional
      if (!optional && !body[property]) {
        pushError(`Missing required property ${property}!`);
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
          pushError(error);
        }
        else if (error instanceof ArgumentError) {
          pushError(error.message);
        }
      }
    }

    // check for errors
    if (errored) {
      const errors = req.session.flash;
      debug('Validation errors: %O', errors);
      if (this.shouldFlash()) {
        res.redirect('back');
      } else {
        req.session.flash = null; // reset the flash store for API calls
        res.status(422).json({ errors });
      }
    } else {
      // filter req.body to only include validated keys
      const newBody = {};
      const validatedKeys = Object.keys(rules);
      for (const key in body) {
        if (validatedKeys.includes(key)) {
          newBody[key] = body[key];
        }
      }

      req.body = newBody;
      next();
    }
  }
}
