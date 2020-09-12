// Require modules
const { createLogger, transports } = require('winston');
const debug = require('debug')('wog:logger');

// Create a logger instance with the config options
const logger = createLogger(config.logging);

// Add a default console logger
logger.add(new transports.Console({
  format: config.logging.format
}));

module.exports = logger;
module.exports.scope = name => logger.child({ label: name });

debug(`Application-wide logging initialized with ${config.logging.transports.length} transports`)
