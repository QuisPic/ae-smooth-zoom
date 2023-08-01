import { AE_OS, OS } from "./constants";

function ZoomPlugin() {
  this.isAvailable = false;

  var libPath = AE_OS === OS.WIN ? "lib:ae-zoom.aex" : "lib:ae-zoom.plugin";
  var foundEO = false;

  try {
    foundEO = ExternalObject.search(libPath);
  } catch (error) {
    foundEO = false;
  }

  if (foundEO) {
    this.externalObject = new ExternalObject(libPath);

    if (this.externalObject.isAvailableFn) {
      this.isAvailable = this.externalObject.isAvailableFn();
    }
  }
}

ZoomPlugin.prototype.updateKeyBindings = function () {
  this.externalObject.updateKeyBindings();
}

ZoomPlugin.prototype.startKeyCapture = function () {
  this.externalObject.startKeyCapture();
}

ZoomPlugin.prototype.endKeyCapture = function () {
  this.externalObject.endKeyCapture();
}

var zoomPlugin = new ZoomPlugin();

export default zoomPlugin;