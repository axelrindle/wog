// Require modules
const { createLogger, transports } = require('winston');
const debug = require('debug')('wog:logger');

module.exports = ({ config }) => {
  // Create a logger instance with the config options
  const logger = createLogger(config.logging);

  // Add a default console logger
  if (config.logging.consoleOutput || process.env.DEBUG) {
    logger.add(new transports.Console({
      format: config.logging.format
    }));
  }

  // Hack some utility into the logger
  logger.scope = name => logger.child({ label: name });

  debug(`Application-wide logging initialized with ${config.logging.transports.length} transports`);

  return logger;
};
