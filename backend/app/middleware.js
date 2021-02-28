// Require modules
const { url } = require('@wogjs/utils');

const checkAuth = module.exports.checkAuth = {

  /**
   * Middleware for checking whether the user is authenticated.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {Function} next The next middleware handler.
   */
  is(req, res, next) {
    if(req.isAuthenticated()) next();
    else {
      res.redirect( url('login') );
    }
  },

  /**
   * Middleware for checking whether the user is not authenticated.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {Function} next The next middleware handler.
   */
  not(req, res, next) {
    if(!req.isAuthenticated()) next();
    else {
      res.redirect( url() );
    }
  }
};

/**
 * Middleware for checking whether the user is an administrator.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
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
 */
module.exports.requireParameters = list => {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  const fun = (req, res, next) => {
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
  return fun;
};
