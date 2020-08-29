// Require modules
const path = require('path');
const { env } = require('../backend/util');
const chalk = require('chalk');

const { format, transports } = require('winston');
const { combine, printf } = format;

const logDirectory = storage.register('logs');

/**
 * Just the raw logging format without coloring.
 *
 * Looks like this: `[timestamp] [label] level: message`
 */
const baseFormat = (() => {
  const myFormat = printf(({ level, message, label, timestamp }) => {
    const _label = label ? label : 'main'; // default label is 'main'
    const prefix = chalk.dim('[' + timestamp + '] [' + _label + ']');
    return `${prefix} ${level}: ${message}`;
  });
  return combine(
    format.timestamp({
      format: env.text('LOG_TIMESTAMP', 'DD.MM.YYYY HH:mm:ss.SSS')
    }),
    format.splat(),
    myFormat
  );
})();

/**
 * Logging is handled by winston.
 *
 * @see https://github.com/winstonjs/winston#readme for configuration options
 */
module.exports = {

  /**
   * The logging level.
   *
   * @see https://github.com/winstonjs/winston#logging
   */
  level: DEBUG ? 'debug' : env.text('LOG_LEVEL', 'info'),

  /**
   * The output format.
   *
   * @see https://github.com/winstonjs/winston#formats
   */
  format: combine(
    baseFormat,
    format.colorize()
  ),

  /**
   * The different output transports to use. A console logger is added by default.
   *
   * @see https://github.com/winstonjs/winston#transports
   */
  transports: [ // TODO: make this customizable more easily (maybe through env variables?)
    new transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error',
      format: combine(
        baseFormat, format.uncolorize()
      )
    }),
    new transports.File({
      filename: path.join(logDirectory, 'combined.log'),
      format: combine(
        baseFormat, format.uncolorize()
      )
    })
  ]

};
