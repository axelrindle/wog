// Require modules
const { getPath } = require('../util');

/**
 * Global locals attached to the express app.
 */
module.exports = app => {
  app.locals = {
    url: config.app.url,
    _debug: DEBUG,

    path: getPath
  };
};
