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

    /**
     * Checks whether the current request path matches the given.
     *
     * @param {string} path The path to check for.
     * @returns {boolean}
     */
    isPath: path => {
      const reqPath = req.originalUrl.split('?')[0];
      return reqPath === path;
    },

    /**
     * Checks whether the current request is on the given path.
     * This also includes sub-paths, e.g. `/api` and `/api/info`.
     *
     * @param {string} path The path to check for.
     * @returns {boolean}
     */
    onPath: path => {
      const reqPath = req.originalUrl.split('?')[0];
      return reqPath.startsWith(path);
    }
  };
  next();
};
