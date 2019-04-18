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
