/* global axios */

// Set base url
const baseUrl = $('base').attr('href');
axios.defaults.baseURL = baseUrl;

/**
 * Some utility functions.
 *
 * @type {Object}
 */
window.helpers = {
  path(path) {
    let url = baseUrl;
    if (!url.endsWith('/'))
      url += '/';

    if (path.startsWith('/'))
      path = path.substring(1);

    return url + path;
  },
  // http://davidwalsh.name/css-animation-callback
  whichAnimationEvent() {
    const el = document.createElement("fakeelement");
    const animations = {
      "animation"      : "animationend",
      "OAnimation"     : "oAnimationEnd",
      "MozAnimation"   : "animationend",
      "WebkitAnimation": "webkitAnimationEnd"
    };
    for (let t in animations){
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }
  }
};

class BetterWebSocket extends WebSocket {
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
  };
}
window.BetterWebSocket = BetterWebSocket;
