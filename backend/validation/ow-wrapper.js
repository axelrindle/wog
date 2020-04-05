// Require modules
const ow = require('ow');

/**
 * Creates a function that runs all the given predicates. The first one that fails is returned.
 *
 * @param {Array|Function} predicates One or more predicates to test for.
 * @returns {string|undefined} The first raised error, or `undefined` when all tests passed.
 */
module.exports = predicates => {
  return async (value) => {
    // loop through each predicate and test it
    for (const predicate of predicates) {
      const type = typeof predicate;
      switch (type) {

        // ow predicate object (sync)
        case 'object':
          ow(value, predicate);
          break;

        // custom function (async)
        case 'function':
          await predicate(value);
          break;

        // invalid type, throw error
        default:
          throw new Error(`Invalid predicate type ${type}!`);
      }
    }
  }
}
