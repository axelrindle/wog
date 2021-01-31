// Require modules
const path = require('path');
const chalk = require('chalk');

const { format, transports } = require('winston');
const { combine, printf } = format;

/**
 * Extracts additional context to a separate object `info.additional`;
 */
const extractAdditional = format(info => {
  const additional = Object.assign({}, info, {
    level: undefined,
    label: undefined,
    message: undefined,
    timestamp: undefined,
    stack: undefined,
    additional: undefined
  });

  if (JSON.stringify(additional) !== '{}') {
    info.additional = additional;
  }

  return info;
});

module.exports = async (container) => {
  const { env } = container.resolve('util');
  const storage = container.resolve('storage');

  const logDirectory = await storage.createDirectory('logs');

  /**
   * Just the raw logging format without coloring.
   *
   * Looks like this: `[timestamp] [label] level: message`
   */
  const baseFormat = (() => {
    const myFormat = printf(info => {
      const label = info.label ? info.label : 'main'; // default label is 'main'
      const prefix = chalk.dim('[' + info.timestamp + '] [' + label + ']');
      let base = `${prefix} ${info.level}: ${info.message}`;
      if (info.stack) {
        base += '\n' + info.stack;
      }
      if (info.additional) {
        base += '\nAdditional context: ' + JSON.stringify(info.additional);
      }
      return base;
    });

    return combine(
      format.timestamp({
        format: env.text('LOG_TIMESTAMP', 'DD.MM.YYYY HH:mm:ss.SSS')
      }),
      format.errors({ stack: true }),
      format.splat(),
      extractAdditional(),
      myFormat
    );
  })();

  /**
   * Logging is handled by winston.
   *
   * @see https://github.com/winstonjs/winston#readme for configuration options
   */
  return {

    /**
     * The logging level.
     *
     * @see https://github.com/winstonjs/winston#logging
     */
    level: env.text('LOG_LEVEL', 'info'),

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
     * Whether to write default log output to the console.
     * Ignored when debugging is enabled.
     */
    consoleOutput: env.bool('LOG_OUTPUT_CONSOLE', true),

    /**
     * The different output transports to use. A console logger is added by default.
     *
     * @see https://github.com/winstonjs/winston#transports
     */
    transports: [ // TODO: make this customizable more easily (maybe through env variables?)
      new transports.File({
        filename: path.join(logDirectory, `error.log`),
        level: 'error',
        format: combine(
          baseFormat, format.uncolorize()
        )
      }),
      new transports.File({
        filename: path.join(logDirectory, `combined.log`),
        format: combine(
          baseFormat, format.uncolorize()
        )
      })
    ]

  };
};
