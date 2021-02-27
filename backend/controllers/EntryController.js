// Require modules
const Controller = require('./Controller');

/**
 * The EntryController is responsible for handling and accessing entries.
 */
module.exports = class EntryController extends Controller {

  init() {
    this.config = this.container.resolve('config');

    /** @type {import('@wogjs/types').PackageRegistry} */
    this.packages = this.container.resolve('packages');
  }

  /**
   * Reads the contents of a given file.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  contents(req, res) {
    const adapter = req.body.adapter;
    const entryId = req.body.id;
    const page = req.body.page || 1;
    const theAdapter = this.container.resolve(adapter);
    theAdapter.getContents(entryId, page)
      .then(contents => {
        res.json(contents);
      })
      .catch(err => {
        const msg = err.message ? err.message : err;
        theAdapter.logger.error(msg);
        res.status(500).json({ type: 'error', msg });
      });
  }

  /**
   * Downloads the given file.
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  download(req, res) {
    // make sure downloading is enabled
    if (!this.config.app.enableFileDownloads)
      return res.status(403).send('Forbidden!');

    const adapter = req.params.adapter;
    const entryId = req.params.id;
    this.container.resolve(adapter).download(res, entryId);
  }

};
