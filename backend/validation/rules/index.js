// Require modules
const path = require('path');
const glob = require('glob');

const exported = {};

// load all files in this directory and map the file basenames to their required content
// e.g. myRule.js => { myRule: require('./myRule.js') }
glob.sync(path.join(__dirname, '*.js'))
  .map(el => path.basename(el, '.js'))
  .filter(el => el !== 'index')
  .forEach(el => {
    const file = path.join(__dirname, el + '.js');
    exported[el] = require(file);
  });

module.exports = exported;
