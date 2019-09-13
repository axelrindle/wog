module.exports = (app, router) => {

  // get middleware
  const { checkAuthenticated, requireParameters } = app.get('middleware');
  const middleware = [checkAuthenticated, requireParameters(['adapter', 'id'])];

  // sends content of a file
  router.post('/contents', middleware, (req, res) => {
    const adapter = req.body.adapter;
    const entryId = req.body.id;
    const theAdapter = adapters.getAdapter(adapter);
    theAdapter.getContents(entryId)
      .then(contents => {
        res.json(contents);
      })
      .catch(err => {
        theAdapter.logger.error(err.message);
        res.status(500).json({ type: 'error', msg: err.message });
      });
  });

  // download a file
  router.get('/download/:adapter/:id', middleware, (req, res) => {
    // make sure downloading is enabled
    if (!config.app.enableFileDownloads)
      return res.status(403).send('Forbidden!');

    const adapter = req.params.adapter;
    const entryId = req.params.id;
    adapters.getAdapter(adapter).download(res, entryId);
  });
};
