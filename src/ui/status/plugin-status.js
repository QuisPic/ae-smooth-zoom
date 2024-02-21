import create from "../../../extern/object-create";
import zoomPlugin from "../../zoomPlugin";
import Status from "./status";
import { ZOOM_PLUGIN_STATUS } from "../../constants";
import bind from "../../../extern/function-bind";

function PluginStatus(parentEl) {
  Status.call(this, parentEl);

  this.pluginFound = false;
  this.pluginStatus = ZOOM_PLUGIN_STATUS.NOT_FOUND;

  this.setPluginStatus();

  var grStatus = this.element.grStatus;
  switch (this.pluginStatus) {
    case ZOOM_PLUGIN_STATUS.NOT_FOUND:
      grStatus.txt.text = "Zoom plug-in is not installed";
      break;
    case ZOOM_PLUGIN_STATUS.FOUND_NOT_INITIALIZED:
      grStatus.txt.text = "Zoom plug-in is found but isn't initialized";
      break;
    case ZOOM_PLUGIN_STATUS.FINISHED:
      grStatus.txt.text = "Zoom plug-in stopped working";
      break;
    case ZOOM_PLUGIN_STATUS.INITIALIZATION_ERROR:
      grStatus.txt.text = "Error initializing Zoom plugin";
      break;
    case ZOOM_PLUGIN_STATUS.INITIALIZED:
      grStatus.txt.text = "Zoom plug-in is installed";
      break;
    default:
      grStatus.txt.text = "Unknown status";
      break;
  }

  grStatus.txt.size = grStatus.txt.graphics.measureString(grStatus.txt.text);

  if (
    this.pluginStatus !== ZOOM_PLUGIN_STATUS.INITIALIZED &&
    this.pluginStatus !== ZOOM_PLUGIN_STATUS.NOT_FOUND
  ) {
    this.fillErrorInfo();
  }
}

PluginStatus.prototype = create(Status.prototype);

PluginStatus.prototype.setPluginStatus = function () {
  this.pluginFound = zoomPlugin.isAvailable();
  this.pluginStatus = zoomPlugin.status();

  if (this.pluginFound) {
    this.setStatusOK();
  } else {
    this.setStatusError();
  }
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
      btnReload: Button { text: 'Reload' }, \
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

  grErrorInfo.btnReload.onClick = bind(function () {
    if (zoomPlugin.foundEO) {
      zoomPlugin.reload();

      this.setPluginStatus();
      this.element.layout.layout(true);
    }
  }, this);
};

export default PluginStatus;
