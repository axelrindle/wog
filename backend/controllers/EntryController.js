// Require modules
const Controller = require('./Controller');

/**
 * The EntryController is responsible for handling and accessing entries.
 */
module.exports = class EntryController extends Controller {

  /**
   * Reads the contents of a given file.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  contents(req, res) {
    const adapter = req.body.adapter;
    const entryId = req.body.id;
    const page = req.body.page || 1;
    const theAdapter = adapters.getAdapter(adapter);
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
   * @param {Express.Request} req
   * @param {Express.Response} res
   */
  download(req, res) {
    // make sure downloading is enabled
    if (!config.app.enableFileDownloads)
      return res.status(403).send('Forbidden!');

    const adapter = req.params.adapter;
    const entryId = req.params.id;
    adapters.getAdapter(adapter).download(res, entryId);
  }

};
