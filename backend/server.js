'use strict';

// Require modules
const fs = require('fs');

const glob = require('glob-all');
const prettyBytes = require('pretty-bytes');
const express = require('express');
const app = express();

const util = require('./util');
const logger = require('./logger');
const pkg = require('../package.json');

// Config and defaults
const config = require('../config');
const debug = config.debug || false;
const port = config.port || 8080;
const url = config.url || '/';
const logs = config.logs || [];
const title = `${pkg.name} v${pkg.version}`;

// Check logs
if (logs.length === 0) {
  logger.fatal('No log file locations were supplied!');
  return;
}

// Update log level
logger.setLevel(debug ? 4 : 3);

// Server setup
app.set('view engine', 'pug');
app.set('views', 'frontend/pug');
app.use(express.static('frontend/static'));

// Load log locations
logger.info("Collecting log files...");
const files = glob.sync(logs);
const filesTransformed = files
  .map((el, index) => {
    const bytes = fs.statSync(el).size;
    const obj = {
      id: index,
      path: util.transformFilePath(el),
      size: prettyBytes(bytes)
    };
    return Object.freeze(obj);
  });
logger.info(`Loaded ${files.length} log files.`);

// Setup routes
app.get('/', (req, res) => {
  res.render('overview', {
    url: url,
    title: `${title} | overview`
  });
});

// sends a list of all files
app.post('/all', (req, res) => res.json(filesTransformed));

// sends content of a file
app.post('/:index', (req, res) => {
  const index = req.params.index;
  // read the data from the given log file and send it back
  fs.readFile(files[index], (err, result) => {
    if (err) {
      logger.error(err);
      res.status(500).send(err);
    }
    else res.send(result);
  });
});

// about page
app.get('/about', (req, res) => {
  res.render('about', {
    url: url,
    title: `${title} | about`,
    version: pkg.version
  });
});

// Start server
app.listen(port, () => logger.info(`Listening on port ${port}.`));
