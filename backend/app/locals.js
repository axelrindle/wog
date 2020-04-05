// Require modules
const { getPath } = require('../util');

/**
 * Returns a middleware function which attaches locals to every request.
 */
module.exports = (req, res, next) => {
  res.locals = {
    // properties
    url: config.app.url,
    _debug: DEBUG,

    // helpers
    path: getPath,
  };
  next();
};
