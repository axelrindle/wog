/**
 * Tests whether an object is empty.
 *
 * @param {Object} obj
 * @returns {boolean} Whether the object is empty.
 */
module.exports = obj => Object.keys(obj).length === 0 && obj.constructor === Object;
