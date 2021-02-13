// Require modules
const getPath = require('../utils/paths');

const checkAuth = module.exports.checkAuth = {

  /**
   * Middleware for checking whether the user is authenticated.
   *
   * @param {Express.Request} req The request.
   * @param {Express.Response} res The response.
   * @param {Function} next The next middleware handler.
   */
  is(req, res, next) {
    if(req.isAuthenticated()) next();
    else {
      res.redirect(getPath('login'));
    }
  },

  /**
   * Middleware for checking whether the user is not authenticated.
   *
   * @param {Express.Request} req The request.
   * @param {Express.Response} res The response.
   * @param {Function} next The next middleware handler.
   */
  not(req, res, next) {
    if(!req.isAuthenticated()) next();
    else {
      res.redirect(getPath());
    }
  }
};

/**
 * Middleware for checking whether the user is an administrator.
 *
 * @param {Express.Request} req The request.
 * @param {Express.Response} res The response.
 * @param {Function} next The next middleware handler.
 */
module.exports.isAdmin = (req, res, next) => {
  checkAuth.is(req, res, () => {
    if (req.user.role === 'admin') next();
    else res.redirect('back');
  });
};

/**
 * Middleware for checking for the existence of request parameters.
 *
 * @param {Express.Request} req The request.
 * @param {Express.Response} res The response.
 * @param {Function} next The next middleware handler.
 */
module.exports.requireParameters = list => {
  return (req, res, next) => {
    const missing = [];

    // find missing params
    list.forEach(el => {
      if (!req.body[el] && !req.params[el]) missing.push(el);
    });

    if (missing.length > 0) {
      res.json({ type: 'error', data: `Missing required parameters: "${missing.join()}"` });
    } else {
      next();
    }
  };
};
