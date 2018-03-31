#!/usr/bin/env node
'use strict';

// Require modules
const fs = require('fs');
const sass = require('node-sass');
const write = require('write');
const cssnano = require('cssnano')({ preset: 'advanced'});

// Files
const input = 'frontend/sass/base.sass';
const output = 'frontend/static/css/style.min.css';

// Process
new Promise((resolve, reject) => { // compile sass
  console.log(`Compile sass from file ${input}...`);
  sass.render({ file: input }, (err, result) => {
    if (err) reject(err);
    else resolve(result.css.toString());
  });
})
.then(result => { // optimize css using cssnano
  console.log('Optimize css using cssnano...');
  return cssnano.process(result);
})
.then(result => { // write css to file
  console.log(`Write css to ${output}...`);
  return new Promise((resolve, reject) => {
    write(output, result, err => {
      if (err) reject(err);
      else resolve();
    });
  });
})
.then(() => console.log('Done.'))
.catch(console.err);
