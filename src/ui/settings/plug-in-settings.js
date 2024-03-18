import { getPluginsFolder } from "../../utils";
import {
  AE_OS,
  OS,
  PLUGIN_FILE_NAME,
  ZOOM_PLUGIN_STATUS,
} from "../../constants";
import zoomPlugin from "../../zoomPlugin";
import FoldingInfo from "../folding-info";
import PluginStatus from "../status/plugin-status";

function PluginSettings(parentEl) {
  zoomPlugin.resetStatus();

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
      txt1: StaticText {}, \
      txt2: StaticText {}, \
      grPath: Group { \
        grSpace: Group { size: [6, 1] }, \
        alignment: 'fill', \
        txtPath: EditText { \
          alignment: ['fill', 'center' ], \
          properties: { readonly: true }, \
          text: 'After Effects Plug-ins folder', \
        }, \
      }, \
      txt3: StaticText { text: '3. Restart After Effects.' }, \
    }",
  );

  grInstallInfo.txt1.text =
    '1. Find the plug-in file at "' +
    (AE_OS == OS.WIN ? "Plug-in/Windows/" : "Plug-in/macOS/") +
    PLUGIN_FILE_NAME +
    '" in the same archive as this script.';

  grInstallInfo.txt2.text =
    "2. Copy the plug-in file (" + PLUGIN_FILE_NAME + ") to:";

  parentGr.grInstallInfo = grInstallInfo;
  var pluginsFolder = getPluginsFolder();

  if (pluginsFolder) {
    grInstallInfo.grPath.txtPath.text =
      pluginsFolder.fsName + (AE_OS === OS.WIN ? "\\" : "/");
  } else if (AE_OS === OS.WIN) {
    grInstallInfo.grPath.txtPath.text =
      "C:/Program Files/Adobe/Adobe After Effects [version]/Support Files/Plug-ins/";
  } else if (AE_OS === OS.MAC) {
    grInstallInfo.grPath.txtPath.text =
      "/Applications/Adobe After Effects [version]/Plug-ins/";
  }
};

export default PluginSettings;
