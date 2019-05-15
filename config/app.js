// Require modules
const { env } = require('../backend/util');

/**
 * Application specific configuration (server settings, etc.)
 */
module.exports = {

  /** The port the server is listening on. */
  port: parseInt(env('APP_PORT', 8082)),

  /** The port the websocket server is listening on. */
  socketPort: parseInt(env('APP_SOCKET_PORT', 8083)),

  /** The full root url for the application. */
  url: env('APP_URL', 'http://localhost:8082/'),

  /**
  * Whether to allow users to download log files to their computer.
  */
  enableFileDownloads: env('ENABLE_FILE_DOWNLOADS', false)

};
