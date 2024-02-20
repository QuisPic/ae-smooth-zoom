import { getPluginsFolder } from "../../utils";
import bind from "../../../extern/function-bind";
import { AE_OS, OS, ZOOM_PLUGIN_STATUS } from "../../constants";
import zoomPlugin from "../../zoomPlugin";
import FoldingInfo from "../folding-info";

function PluginSettings(parentEl) {
  zoomPlugin.resetStatus();

  this.element = parentEl.add(
    "tab { \
      text: 'Plug-in', \
      alignChildren: ['fill', 'top'], \
      margins: [12, 0, 0, 0], \
      spacing: 10, \
      grTxt: Group { \
        margins: [0, 10, 0, 0], \
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
      pnlStatus: Panel { \
        alignChildren: 'fill', \
      }, \
    }",
  );

  /** Fill plug-in install info */
  this.element.pnlInstallPlugin = new FoldingInfo(
    this.element,
    this.fillInstallInfo,
    "How to install the plug-in",
  );

  /** Create a group that holds plug-in status info */
  this.createPluginStatusGroup();

  /** Check if Zoom plug-in is available */
  this.setPluginStatus();

  if (this.pluginStatus !== ZOOM_PLUGIN_STATUS.INITIALIZED) {
    this.fillErrorInfo(this.element.pnlStatus);
    this.element.pnlInstallPlugin.unfoldInfo();
  }
}

PluginSettings.prototype.createPluginStatusGroup = function () {
  var pnlStatus = this.element.pnlStatus;

  pnlStatus.grStatus = pnlStatus.add(
    "Group {\
      spacing: 6, \
      statusIcon: Group { preferredSize: [8, 8] }, \
      txt: StaticText {}, \
    }",
  );

  var grStatus = pnlStatus.grStatus;
  var statusIcon = grStatus.statusIcon;

  statusIcon.onDraw = bind(function () {
    var g = grStatus.statusIcon.graphics;
    var c = this.pluginFound ? [0.1, 0.85, 0.1, 1] : [1, 0, 0, 1];
    var p = g.newPen(g.PenType.SOLID_COLOR, c, 2);

    if (this.pluginFound) {
      g.moveTo(0, 3);
      g.lineTo(3, 6);
      g.lineTo(8, 0);
    } else {
      g.moveTo(0, 0);
      g.lineTo(8, 8);
      g.strokePath(p);

      g.currentPath = g.newPath();

      g.moveTo(8, 0);
      g.lineTo(0, 8);
    }

    g.strokePath(p);
  }, this);
};

PluginSettings.prototype.setPluginStatus = function () {
  var pnlStatus = this.element.pnlStatus;
  var grStatus = pnlStatus.grStatus;

  this.pluginFound = zoomPlugin.isAvailable();
  this.pluginStatus = zoomPlugin.status();

  pnlStatus.graphics.backgroundColor = pnlStatus.graphics.newBrush(
    pnlStatus.graphics.BrushType.SOLID_COLOR,
    this.pluginFound ? [0.12, 0.2, 0.12, 1] : [0.2, 0.12, 0.12, 1],
  );

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

  // if (!this.pluginFound) {
  //   this.unfoldInfo();
  // } else if (this.unfoldInfo) {
  //   this.foldInfo();
  // }
};

// PluginSettings.prototype.fillGetPluginInfo = function (parentGr) {
//   var grGetPluginInfo = parentGr.add(
//     "Group { \
//       orientation: 'column', \
//       alignChildren: ['left', 'center'], \
//       spacing: 5, \
//       txt0: StaticText { text: 'Search for the file named Zoom.aex (Windows) or Zoom.plugin (Mac) in the same archive as this script.' }, \
//       txt1: StaticText { text: \"The archive can be downloaded from any of the following sources:\" }, \
//       txt2: StaticText { text: 'Gumroad' }, \
//       txt2: StaticText { text: 'GitHub' }, \
//     }",
//   );
//
//   parentGr.grGetPluginInfo = grGetPluginInfo;
// };

PluginSettings.prototype.fillInstallInfo = function (parentGr) {
  var pluginFileName = AE_OS === OS.WIN ? "Zoom.aex" : "Zoom.plugin";
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
    "1. Find the file named " +
    pluginFileName +
    " in the same archive as this script.";

  grInstallInfo.txt2.text = "2. Copy the file (" + pluginFileName + ") to:";

  // if (AE_OS === OS.WIN) {
  //   grInstallInfo.grWin = grInstallInfo.add(
  //     "Group { \
  //       alignment: 'fill', \
  //       grSpace: Group { size: [6, 1] }, \
  //       txtWin: StaticText { text: 'Windows:' }, \
  //       txtPath: EditText { \
  //         text: 'C:/Program Files/Adobe/Adobe After Effects [version]/Support Files/Plug-ins/', \
  //         alignment: ['fill', 'center' ], \
  //         properties: { readonly: true }, \
  //       }, \
  //     }",
  //   );
  // }

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

  // var txtMac = grInstallInfo.grMac.txtMac;
  // var g = txtMac.graphics;
  // txtMac.size = g.measureString("Windows:");

  // grInstallInfo.grSave.btnSaveWin.onClick = function () {
  //   saveFileFromBinaryString(zoomPluginWin, "Zoom-Windows.zip");
  // };
  //
  // grInstallInfo.grSave.btnSaveMac.onClick = function () {
  //   saveFileFromBinaryString(zoomPluginMac, "Zoom-macOS.zip");
  // };
};

PluginSettings.prototype.fillErrorInfo = function (parentGr) {
  var grErrorInfo = parentGr.add(
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

  parentGr.grErrorInfo = grErrorInfo;

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

export default PluginSettings;
