// Require modules
const nanoid = require('nanoid/generate');

const myLogger = logger.scope('websocket');

/**
 * Shorthand function for sending an error to the client.
 * @param  {WebSocket} ws The WebSocket instance.
 * @param  {any}       e  The error.
 */
const sendError = (ws, e) => {
  ws.send({ type: 'error', data: e });
};

/**
 * Handles a websocket route request.
 *
 * @param {WebSocket} ws A websocket instance.
 * @param {Request} req The express request instance.
 */
module.exports = (ws, req) => {
  let currentAdapter;
  let contentsUpdateListener;
  // TODO: Figure out how to integrate websockets with the adapters
  ws.on('message', message => {
    myLogger.watch(message);
    return;
    try {
      const parsed = JSON.parse(message);
      switch (parsed.event) {
        case 'changeAdapter':
          //if (currentAdapter) currentAdapter.removeL
          currentAdapter = adapters.getAdapter(parsed.adapter);
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

  });
};
