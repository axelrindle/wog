// Require modules
const { getPath } = require('../util');

// Locals used in the templates
module.exports = app => {
  app.locals = {
    url: config.app.url,
    _debug: DEBUG,

    path: getPath
  };
};
