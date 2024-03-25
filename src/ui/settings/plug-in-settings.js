import { getPluginsFoldersPaths, openURL } from "../../utils";
import {
  AE_OS,
  OS,
  PLUGIN_FILE_NAME,
  ZOOM_PLUGIN_STATUS,
} from "../../constants";
import zoomPlugin from "../../zoomPlugin";
import FoldingInfo from "../folding-info";
import PluginStatus from "../status/plugin-status";
import bind from "../../../extern/function-bind";

function PluginSettings(parentEl) {
  zoomPlugin.resetStatus();
  this.tabs = parentEl;

  this.element = parentEl.add(
    "tab { \
      text: 'Plug-in', \
      alignChildren: ['fill', 'top'], \
      margins: [12, 10, 0, 10], \
      spacing: 10, \
      grTxt: Group { \
        orientation: 'column', \
        alignChildren: 'left', \
        spacing: 4, \
        txt0: StaticText { \
          text: 'Zoom plug-in provides additional features to the script.', \
        }, \
        txt0: StaticText { \
          text: 'It is necessary to have the plug-in installed to use Key Bindings and Experimental settings.', \
        }, \
      }, \
    }",
  );

  this.element.pluginStatusPanel = new PluginStatus(this.element);

  if (
    zoomPlugin.status() !== ZOOM_PLUGIN_STATUS.NOT_FOUND &&
    zoomPlugin.status() !== ZOOM_PLUGIN_STATUS.INITIALIZED_NOT_FOUND
  ) {
    this.element.grMisc = this.element.add(
      "Panel { \
        alignChildren: ['left', 'top'], \
        text: 'Plug-in', \
        txtVersion: StaticText {}, \
        txtLocation: StaticText {}, \
        grReload: Group { \
          txt: StaticText { text: 'Reload Plug-in: ' }, \
          btnReload: IconButton { \
            title: 'Reload', \
            preferredSize: [100, 22], \
          }, \
        }, \
      }",
    );

    this.element.grMisc.txtVersion.text =
      "Version: " + (zoomPlugin.getVersion() || "unknown");
    this.element.grMisc.txtLocation.text =
      "Location: " + (zoomPlugin.path || "unknown");
    this.element.grMisc.grReload.btnReload.onClick = bind(function () {
      if (zoomPlugin.foundEO) {
        zoomPlugin.reload();

        this.element.pluginStatusPanel.setPluginStatus();
        this.tabs.keyBindings.reloadStatus();
        this.tabs.experimentalSettings.reloadStatus();

        this.element.layout.layout(true);
        this.element.layout.resize();
      }
    }, this);
  }

  /** Fill plug-in install info */
  this.element.pnlInstallPlugin = new FoldingInfo(
    this.element,
    this.fillInstallInfo,
    "How to install the plug-in",
  );

  if (
    this.element.pluginStatusPanel.pluginStatus !==
    ZOOM_PLUGIN_STATUS.INITIALIZED
  ) {
    this.element.pnlInstallPlugin.unfoldInfo();
  }
}

PluginSettings.prototype.fillInstallInfo = function (parentGr) {
  var grInstallInfo = parentGr.add(
    "Group { \
      orientation: 'column', \
      alignChildren: ['left', 'center'], \
      txt1: StaticText { \
        characters: 50, \
        properties: { multiline: true } \
      }, \
      txt2: StaticText {}, \
      grPath: Group { \
        alignment: 'fill', \
        orientation: 'column', \
      }, \
      txt3: StaticText { text: '3. Restart After Effects.' }, \
    }",
  );

  grInstallInfo.txt1.text =
    "1. Find the plug-in file in the same archive that contains this script. The plug-in can be found at '" +
    (AE_OS == OS.WIN ? "Plug-in/Windows/" : "Plug-in/macOS/") +
    PLUGIN_FILE_NAME +
    "' inside the archive.";

  grInstallInfo.txt2.text =
    "2. Copy the plug-in file (" +
    PLUGIN_FILE_NAME +
    ") in one of the following directories:";

  parentGr.grInstallInfo = grInstallInfo;

  function addPathElement(parentEl, path, title) {
    var grPath = parentEl.add(
      "Group { \
        alignment: 'fill', \
        alignChildren: 'fill', \
        orientation: 'column', \
        spacing: 3, \
        txtTitle: StaticText {}, \
        grTextPath: Group { \
          margins: [12, 0, 0, 0], \
          txtPath: EditText { \
            alignment: ['fill', 'center' ], \
            properties: { readonly: true }, \
            text: 'After Effects Plug-ins folder', \
          }, \
          btnOpen: IconButton { \
            alignment: ['right', 'center' ], \
            title: 'Open', \
            preferredSize: [60, 22], \
          }, \
        }, \
      }",
    );

    grPath.txtTitle.text = title;
    grPath.grTextPath.txtPath.text = path;
    grPath.grTextPath.btnOpen.onClick = function () {
      var folder = new Folder(path);
      if (folder.exists) {
        openURL(path);
      } else {
        alert("Folder does not exist.");
      }
    };
  }

  var pluginsFoldersPaths = getPluginsFoldersPaths();

  addPathElement(
    grInstallInfo.grPath,
    pluginsFoldersPaths.common,
    "(Recommended) For all versions of After Effects:",
  );
  addPathElement(
    grInstallInfo.grPath,
    pluginsFoldersPaths.individual,
    "Only for this version of After Effects:",
  );
};

export default PluginSettings;
