module.exports = class BetterWebSocket extends WebSocket {
  /**
   * Wrapper function for installing an event listener.
   * @param {string} event The event name.
   * @param {Function} callback The event callback.
   * @return {WebSocket} This websocket to allow for chaining.
   */
  on(event, callback) {
    const theEvent = `on${event}`;
    this[theEvent] = callback;
    return this;
  }
};
