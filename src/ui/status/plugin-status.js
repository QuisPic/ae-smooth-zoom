import create from "../../../extern/object-create";
import zoomPlugin from "../../zoomPlugin";
import Status from "./status";
import { ZOOM_PLUGIN_STATUS } from "../../constants";

function PluginStatus(parentEl) {
  Status.call(this, parentEl);
  this.setPluginStatus();
}

PluginStatus.prototype = create(Status.prototype);

PluginStatus.prototype.statusMessage = {};
PluginStatus.prototype.statusMessage[ZOOM_PLUGIN_STATUS.NOT_FOUND] =
  "Zoom plug-in is not installed";
PluginStatus.prototype.statusMessage[ZOOM_PLUGIN_STATUS.FOUND_NOT_INITIALIZED] =
  "Zoom plug-in is found but is not loaded by After Effects";
PluginStatus.prototype.statusMessage[ZOOM_PLUGIN_STATUS.FINISHED] =
  "Zoom plug-in stopped working";
PluginStatus.prototype.statusMessage[ZOOM_PLUGIN_STATUS.INITIALIZATION_ERROR] =
  "Error initializing Zoom plugin";
PluginStatus.prototype.statusMessage[ZOOM_PLUGIN_STATUS.INITIALIZED] =
  "Zoom plug-in is installed";

PluginStatus.prototype.setPluginStatus = function () {
  var statusChanged = this.pluginStatus !== zoomPlugin.status();

  if (statusChanged) {
    this.pluginStatus = zoomPlugin.status();
    this.pluginFound = zoomPlugin.isAvailable();
    var grStatus = this.element.grStatus;

    if (this.pluginFound) {
      this.setStatusOK();
    } else {
      this.setStatusError();
    }

    /** first, remove existing info */
    if (grStatus.gr.grText.children.length > 0) {
      var grText = grStatus.gr.grText;
      for (var i = grText.children.length - 1; i >= 0; i--) {
        grText.remove(i);
      }
    }

    if (this.element.grErrorInfo) {
      this.element.remove(this.element.grErrorInfo);
      this.element.grErrorInfo = undefined;
    }

    /** add new info */
    var txt = grStatus.gr.grText.add("StaticText {}");

    if (this.pluginStatus in this.statusMessage) {
      txt.text = this.statusMessage[this.pluginStatus];
    } else {
      txt.text = "Unknown plug-in status";
    }

    if (
      this.pluginStatus !== ZOOM_PLUGIN_STATUS.INITIALIZED &&
      this.pluginStatus !== ZOOM_PLUGIN_STATUS.NOT_FOUND
    ) {
      this.fillErrorInfo();
    }
  }

  return statusChanged;
};

PluginStatus.prototype.fillErrorInfo = function () {
  var grErrorInfo = this.element.add(
    "Group { \
      orientation: 'column', \
      alignChildren: ['center', 'top'], \
      txt: StaticText { \
        alignment: 'fill', \
        properties: { \
          multiline: true, \
        }, \
      }, \
    }",
  );

  this.element.grErrorInfo = grErrorInfo;

  var errorText = "";
  if (zoomPlugin.foundEO) {
    try {
      errorText = zoomPlugin.getError();
    } catch (error) {
      /**/
    }
  }

  if (errorText) {
    grErrorInfo.txt.text = errorText;
    grErrorInfo.txt.characters = 50; // this fixes the height of the text
  } else if (zoomPlugin.status() === ZOOM_PLUGIN_STATUS.FOUND_NOT_INITIALIZED) {
    grErrorInfo.txt.text = "Try restarting After Effects.";
  }
};

export default PluginStatus;
