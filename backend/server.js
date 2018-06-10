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
const debug = process.env.DEBUG || false;
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

// Short debug notice
if (debug) logger.warn('DEBUG MODE ENABLED! REMEMBER TO TURN OFF!')

// Server setup
app.set('view engine', 'pug');
app.set('views', 'frontend/pug');
app.use(express.static('frontend/static'));

// TODO: Watch for file changes and reload them automagically on the frontend
// Load log locations
logger.info("Collecting log files...");
const files = glob.sync(logs);
const filesTransformed = files
  .map((el, index) => Object.freeze({
    id: index,
    path: util.transformFilePath(el),
    size: prettyBytes(fs.statSync(el).size)
  }));
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

// download a file
app.get('/:index/download', (req, res) => {
  if (config.enableFileDownloads) {
    const index = req.params.index;
    if (index > -1) {
      res.download(files[index]);
    } else {
      res.status(400).send('The ID "-1" is invalid!');
    }
  } else {
    res.status(403).send('Forbidden!');
  }
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
