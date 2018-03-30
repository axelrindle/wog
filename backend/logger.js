'use strict';

// Require modules
const moment = require('moment');

/** Available log levels. */
const levels = [ 'fatal', 'error', 'warn', 'info', 'debug' ]

/** The highest level to log. */
let level = 3;

/**
 * Logs the given message with the given level to the console.
 */
const log = (n, lvl, message) => {
  if (n <= level) {
    const timestamp = moment().format('DD.MM.YYYY HH:mm:ss');
    const str = `[${timestamp}] (${lvl.toUpperCase()})  >>>  ${message}`;
    console.log(str);
  }
};

// setup functions
const logger = {};
levels.forEach((l, i) => {
  logger[l] = message => log(i, l, message);
});
logger.setLevel = newLevel => {
  const max = levels.length - 1;
  if (newLevel >= 0 && newLevel <= max)
    level = newLevel;
  else
    throw new Error(`Log level must be between 0 and ${max}`);
};

// export logger object
module.exports = logger;
