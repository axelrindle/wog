// Require modules
const nanoid = require('nanoid/generate');
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
 * @param {Request} req The express request instance.
 */
// eslint-disable-next-line no-unused-vars
module.exports = (ws, req) => {
  // a unique connection id is used to identify this connection
  // to the adapters
  const connectionId = nanoid(NANOID_ALPHABET, 10);
  myLogger.info("Connection opened with ID " + connectionId);

  let currentAdapter;

  // TODO: Figure out how to integrate websockets with the adapters
  ws.on('message', message => {
    try {
      const parsed = JSON.parse(message);
      myLogger.debug(parsed);
      switch (parsed.event) {
        case 'changeAdapter':
          currentAdapter = adapters.getAdapter(parsed.adapter);
          if (currentAdapter.supportsEvents())
            currentAdapter.registerSocket(connectionId, ws);
          break;
        case 'changeEntry':
          currentAdapter.watchEntry(parsed.entry);
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

  ws.on('close', () => {
    myLogger.info("Connection closed with ID " + connectionId);
    // if we have an old adapter registered, remove it
    if (currentAdapter && currentAdapter.supportsEvents())
      currentAdapter.unregisterSocket(connectionId);
  });
};
