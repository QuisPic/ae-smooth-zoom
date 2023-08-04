import { PLUGIN_FILE_NAME } from "./constants";
import { getPluginsFolder } from "./utils";

function ZoomPlugin() {
  this.isAvailable = false;

  var libPath = "lib:" + PLUGIN_FILE_NAME;
  var foundEO = false;

  try {
    foundEO = ExternalObject.search(libPath);
  } catch (error) {
    /* if the plugin isn't found in the standard search folders 
    try to search explicitly in the plugins folder */
    var pluginsFolder = getPluginsFolder();

    if (pluginsFolder) {
      var pluginFile = File(pluginsFolder.fullName + "/" + PLUGIN_FILE_NAME);

      if (pluginFile.exists) {
        libPath = "lib:" + pluginFile.fsName;

        try {
          foundEO = ExternalObject.search(libPath);
        } catch (error) {
          /**/
        }
      }
    }
  }

  if (foundEO) {
    try {
      this.externalObject = new ExternalObject(libPath);

      if (this.externalObject.isAvailableFn) {
        this.isAvailable = this.externalObject.isAvailableFn();
      }
    } catch (error) {
      alert(
        "Error opening Zoom plug-in.\nError at line " +
          $.line +
          ":\n" +
          error.message,
      );
      foundEO = false;
    }
  }
}

ZoomPlugin.prototype.updateKeyBindings = function () {
  this.externalObject.updateKeyBindings();
};

ZoomPlugin.prototype.startKeyCapture = function () {
  this.externalObject.startKeyCapture();
};

ZoomPlugin.prototype.endKeyCapture = function () {
  this.externalObject.endKeyCapture();
};

var zoomPlugin = new ZoomPlugin();

export default zoomPlugin;
