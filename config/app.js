// Require modules
const { env } = require('@wogjs/utils');

/**
 * Application specific configuration (server settings, etc.)
 */
module.exports = container => {
  return {

    /** The port the server is listening on. */
    port: env.int('APP_PORT', 8082),

    /** The port the websocket server is listening on. */
    socketPort: env.int('APP_SOCKET_PORT', 8083),

    /** Whether the application is running behind a proxy. */
    isProxy: env.bool('APP_IS_BEHIND_PROXY', false),

    /** The full root url for the application. */
    url: env.text('APP_URL', 'http://localhost:8082/'),

    /** Whether to allow users to download log files to their computer. */
    enableFileDownloads: env.bool('ENABLE_FILE_DOWNLOADS', false)

  };
};
