// Require modules
const nanoid = require('nanoid/generate');

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
 * @param  {WebSocket} ws  A websocket instance.
 * @param  {Request}   req The express request instance.
 */
module.exports = (ws, req) => {
  const connectionId = nanoid(NANOID_ALPHABET, 10);

  ws.on('message', message => {
    try {
      const parsed = JSON.parse(message);
      switch (parsed.type) {
        case 'changeFile':

          break;
        default:
          sendError(ws, `Unknown event "${parsed.type}"!`);
          break;
      }
    } catch (e) {
      sendError(ws, e);
    }
  });

  ws.on('close', () => {

  });
};
