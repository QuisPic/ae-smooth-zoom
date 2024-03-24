import { AE_OS, OS, PLUGIN_FILE_NAME, ZOOM_PLUGIN_STATUS } from "./constants";
import { getPluginsFolder } from "./utils";

function ZoomPlugin() {
  this._status = undefined;
  this.foundEO = false;
  this.externalObject = undefined;
}

ZoomPlugin.isZoomPlugin = function (extObject) {
  return extObject && extObject.quis_zoom_plugin;
};

ZoomPlugin.loadExternalObject = function (libPath) {
  try {
    var foundExtObject = ExternalObject.search(libPath);
  } catch (error) {
    /**/
  }

  if (foundExtObject) {
    try {
      var extObject = new ExternalObject(libPath);
    } catch (error) {
      /**/
    }
  }

  return extObject;
};

ZoomPlugin.searchForPlugin = function (folder) {
  var result;
  var files = folder.getFiles();

  for (var i = 0; i < files.length; i++) {
    var extObject = ZoomPlugin.loadExternalObject("lib:" + files[i].fsName);
    if (ZoomPlugin.isZoomPlugin(extObject)) {
      result = extObject;
      break;
    }
  }

  /** If plugin is not found is this folder search in sub-folders*/
  if (!result) {
    for (i = 0; i < files.length; i++) {
      if (files[i] instanceof Folder) {
        /** skip plug-ins on macos */
        if (AE_OS === OS.MAC && files[i].name.indexOf(".plugin") !== -1) {
          continue;
        }

        result = ZoomPlugin.searchForPlugin(files[i]);

        if (result) {
          break;
        }
      }
    }
  }

  return result;
};

ZoomPlugin.prototype.findPlugin = function () {
  if ($.global.__quis_zoom_plugin_is_loaded) {
    var libPath = "lib:" + PLUGIN_FILE_NAME;
    var extObject = ZoomPlugin.loadExternalObject(libPath);

    /** if the plugin isn't found in the standard search folderstry
     * try to search explicitly in the plugins folder */
    if (!extObject) {
      var pluginsFolder = getPluginsFolder();

      if (pluginsFolder.exists) {
        extObject = ZoomPlugin.searchForPlugin(pluginsFolder);
      }
    }

    if (extObject) {
      this.foundEO = true;
      this.externalObject = extObject;
    }
  }
};

ZoomPlugin.prototype.status = function () {
  if (this._status === undefined) {
    this._status = ZOOM_PLUGIN_STATUS.NOT_FOUND;

    if (!this.externalObject) {
      this.findPlugin();
    }

    if (this.externalObject) {
      try {
        if (this.externalObject.status) {
          this._status = ZOOM_PLUGIN_STATUS.FOUND_NOT_INITIALIZED;

          var pluginStatus = this.externalObject.status();

          if (pluginStatus !== undefined) {
            this._status = pluginStatus; // INITIALIZATION_ERROR or INITIALIZED
          }
        }
      } catch (error) {
        alert(
          "Error loading Zoom plug-in.\nError at line " +
            $.line +
            ":\n" +
            error.message,
        );
      }
    }
  }

  return this._status;
};

ZoomPlugin.prototype.resetStatus = function () {
  this._status = undefined;
};

ZoomPlugin.prototype.isAvailable = function () {
  return this.status() === ZOOM_PLUGIN_STATUS.INITIALIZED;
};

ZoomPlugin.prototype.getError = function () {
  if (this.externalObject.getError) {
    return this.externalObject.getError();
  }
};

ZoomPlugin.prototype.reload = function () {
  if (this.externalObject.reload) {
    this._status = this.externalObject.reload();
  }
};

ZoomPlugin.prototype.updateKeyBindings = function () {
  if (this.externalObject.updateKeyBindings) {
    this.externalObject.updateKeyBindings();
  }
};

ZoomPlugin.prototype.updateExperimentalOptions = function () {
  if (this.externalObject.updateExperimentalOptions) {
    this.externalObject.updateExperimentalOptions();
  }
};

ZoomPlugin.prototype.updateHighDpiOptions = function () {
  if (this.externalObject.updateHighDpiOptions) {
    this.externalObject.updateHighDpiOptions();
  }
};

ZoomPlugin.prototype.startKeyCapture = function () {
  if (this.externalObject.startKeyCapture) {
    this.externalObject.startKeyCapture();
  }
};

ZoomPlugin.prototype.endKeyCapture = function () {
  if (this.externalObject.endKeyCapture) {
    this.externalObject.endKeyCapture();
  }
};

ZoomPlugin.prototype.postZoomAction = function (actionType, amount) {
  var isActionPosted = false;

  if (this.externalObject.postZoomAction) {
    isActionPosted = this.externalObject.postZoomAction(actionType, amount);
  }

  return isActionPosted;
};

ZoomPlugin.prototype.getVersion = function () {
  var result;
  
  if (this.externalObject.getVersion) {
    result = this.externalObject.getVersion();
  }

  return result;
};

var zoomPlugin = new ZoomPlugin();

export default zoomPlugin;
