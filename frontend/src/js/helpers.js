// (adapted) Function from David Walsh: http://davidwalsh.name/css-animation-callback
export function whichAnimationEvent() {
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
