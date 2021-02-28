// Require modules
const { isDebug, url } = require('@wogjs/utils');

const middleware = (req, res, next) => {
  const container = req.app.get('container');
  const config = container.resolve('config');

  res.locals = Object.assign({}, res.locals, {
    // properties
    baseUrl: config.app.url,
    isDebug,

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
  });
  next();
};

/**
 * @param {import('express').Application} app
 * @param {import('nunjucks').Environment} nunjucksEnvironment
 */
module.exports = (app, nunjucksEnvironment) => {
  app.use(middleware);

  nunjucksEnvironment.addGlobal('url', url);
};
