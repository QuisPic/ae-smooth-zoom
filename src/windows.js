function ZoomWindows() {
  this.windows = [];
}

ZoomWindows.prototype.close = function (uiObj) {
  if (typeof uiObj === "object" && uiObj.element && isValid(uiObj.element)) {
    uiObj.element.close();
  }
}

ZoomWindows.prototype.new = function (win) {
  var winObj;
  if (typeof win === "function") {
    winObj = new win();
  } else if (typeof win === "object") {
    winObj = win;
  } else {
    alert("Zoom error:\nCannot create new window of type " + (typeof win));
    return;
  }
  
  /** close all windows of the same type */
  for (var i = 0; i < this.windows.length; i++) {
    if (this.windows[i].__proto__ === winObj.__proto__) {
      this.close(this.windows[i]);
    }
  }

  this.windows.push(winObj);
}

var windows = new ZoomWindows();

export default windows;
