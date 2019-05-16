/**
 * @author Nicolas Bevacqua
 * @copyright Copyright © 2015 Nicolas Bevacqua
 * @see https://github.com/bevacqua/fuzzysearch/blob/master/index.js
 */
function fuzzytest (needle, haystack) {
  var hlen = haystack.length;
  var nlen = needle.length;
  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needle === haystack;
  }
  outer: for (var i = 0, j = 0; i < nlen; i++) {
    var nch = needle.charCodeAt(i);
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}

module.exports = (needle, haystack) => {
  return haystack.filter(entry => fuzzytest(needle, entry));
}
