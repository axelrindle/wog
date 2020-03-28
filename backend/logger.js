// Require modules
const { createLogger, transports } = require('winston');

// Create a logger instance with the config options
const logger = createLogger(config.logging);

// Add a default console logger
logger.add(new transports.Console({
  format: config.logging.format
}));

module.exports = logger;
module.exports.scope = name => logger.child({ label: name });
