/**
 * Application specific configuration (server settings, etc.)
 */
module.exports = {

  /** The port the server is listening on. */
  port: 8082,

  /** The port the websocket server is listening on. */
  socketPort: 8083,

  /** The full root url for the application. */
  url: 'http://localhost:8082/',

  /**
  * Whether to allow users to download log files to their computer.
  */
  enableFileDownloads: false

};
