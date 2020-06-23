// Require modules
const nanoid = require('nanoid/generate');
const expressWs = require('express-ws');
const WebSocket = require('ws');

const { NANOID_ALPHABET } = require('../util');

const myLogger = logger.scope('websocket');

/**
 * Shorthand function for sending an error to the client.
 *
 * @param  {WebSocket} ws The WebSocket instance.
 * @param  {any}       e  The error.
 */
const sendError = (ws, e) => {
  ws.send({ type: 'error', msg: e });
};

/**
 * Handles a websocket route request.
 *
 * @param {WebSocket} ws A websocket instance.
 */
const handler = ws => {
  // a unique connection id is used to identify this connection
  // to the adapters
  const connectionId = nanoid(NANOID_ALPHABET, 10);
  myLogger.info("Connection opened with ID " + connectionId);

  let currentAdapter;

  ws.on('message', message => {
    try {
      const parsed = JSON.parse(message);
      if (DEBUG) myLogger.debug(message);
      switch (parsed.event) {
        case 'changeAdapter':
          if (currentAdapter) {
            currentAdapter.unregisterSocket(connectionId);
          }
          currentAdapter = adapters.getAdapter(parsed.adapter);
          if (currentAdapter.supportsEvents()) {
            currentAdapter.registerSocket(connectionId, ws);
          }
          break;
        case 'changeEntry':
          if (currentAdapter.supportsEvents()) {
            currentAdapter.watchEntry(connectionId, parsed.entry)
              .catch(err => sendError(ws, err));
          }
          break;
        default:
          sendError(ws, `Unknown event "${parsed.event}"!`);
          break;
      }
    } catch (e) {
      myLogger.error(e);
      sendError(ws, e);
    }
  });

  ws.on('close', code => {
    myLogger.info(`Connection closed with ID ${connectionId} (code: ${code})`);
    // if we have an old adapter registered, remove it
    if (currentAdapter && currentAdapter.supportsEvents())
      currentAdapter.unregisterSocket(connectionId);
  });
};

/**
 * Initialize a WebSocket server.
 */
module.exports = app => {
  let server;

  // based on whether we are running behind a proxy, deploy the /socket route
  // or create my own WebSocket server instance
  if (!config.app.isProxy) {
    server = expressWs(app).getWss();
    app.ws('/socket', handler);
  } else {
    server = new WebSocket.Server({ port: config.app.socketPort });
    server.on('connection', handler);
    server.on('error', error => {
      myLogger.error(error);
    });
  }

  myLogger.info(`WebSocket server accessible via ${config.app.isProxy ? 'port ' + config.app.socketPort : '/socket endpoint'}.`);

  return server;
};
