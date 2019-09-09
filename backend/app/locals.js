// Require modules
const { getPath } = require('../util');

/**
 * Global locals attached to the express app.
 */
module.exports.global = app => {
  app.locals = {
    url: config.app.url,
    _debug: DEBUG,

    path: getPath
  };
};

/**
 * Local locals attached to every response.
 */
module.exports.local = req => {
  return {
    isAuthenticated: req.user !== undefined,
    user: req.user
  };
};
