// Require modules
const { getPath } = require('../util');

module.exports = myLogger => ({
  checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) next();
    else {
      myLogger.warn('Unauthenticated request: ' + req);
      res.redirect(getPath('login'));
    }
  },
  requireParameters(list) {
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
  }
});
