// Require modules
const ow = require('ow');

module.exports = ow.string.oneOf(['user', 'admin']);
