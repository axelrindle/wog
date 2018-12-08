// Require modules
const fs = require('fs');
const path = require('path');

const glob = require('glob-all');
const isFile = require('is-file');
const prettyBytes = require('pretty-bytes');

/**
 * Transforms a path to show the filename and the parent directory.
 */
const transformFilePath = file => {
  const parent = path.basename(path.dirname(file));
  const base = path.basename(file);
  return path.join(parent, base);
};

/**
 * Loads all files from the given glob and returns a transformed object.
 */
module.exports.loadLogFiles = logs => {

  // find all files from the given glob
  return new Promise((resolve, reject) => {
    glob(logs, { silent: true },(err, matches) => {
      if (err) reject(err);
      else resolve(matches);
    });
  })

  // transform the path into an object with more data
  .then(matches => {
    return matches
      .filter(el => isFile(el))
      .map((el, index) => ({
        absolute: el, // preserve absolute path
        path: transformFilePath(el), // path to be shown to the user
        size: prettyBytes(fs.statSync(el).size) // estimated file size
        // TODO: Size must be recalculated when a file is updated
      }));
  })

  // return an object holding a list for internal use
  // and a list to be used at the frontend
  .then(transformed => ({
    transformed,
    frontend: transformed.map(el => ({
      path: el.path,
      size: el.size
    }))
  }));
};
