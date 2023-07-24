import { checkOs, saveFileFromBinaryString } from "../utils";
import bind from "../../extern/function-bind";
import zoomPluginBin from "../../extern/zoom-plugin";
import { OS } from "../constants";
import KeyBinding from "./key-binding";
import KeyCapture from "./key-capture";
import Line from "./line";
import JSON from "../../extern/json2";
import ColumnNames from "./column-names";
import preferences from "../preferences";

function PluginWindow() {
  var thisWindow = this;
  this.keyBindingsArr = [];
  this.linesArr = [];

  if (!$.global.__zoom_plugin_cmd_ids__) {
    var saveCmdIdsId = app.findMenuCommandId("__zoom_save_cmd_ids__");

    if (saveCmdIdsId) {
      app.executeCommand(saveCmdIdsId);
    }
  }

  this.pluginFound = !!$.global.__zoom_plugin_cmd_ids__;
  this.isUnfoldInfo = !this.pluginFound;

  this.element = new Window("palette", "Zoom Key Bindings", undefined, {
    resizeable: false,
  });

  this.element.onResize = function () {
    this.layout.resize();
  };

  this.element.onResizing = this.element.onResize;
  this.element.alignChildren = ["center", "center"];

  this.element.gr = this.element.add(
    "Group { \
      orientation: 'column', \
      alignChildren: ['fill', 'center'], \
      pnlInstallPlugin: Panel { \
        alignChildren: 'fill', \
      }, \
      pnlKeyBindings: Panel { \
        alignment: 'fill', \
        orientation: 'column', \
        margins: 0, \
        spacing: 0, \
        grColumnNames: Group { \
          alignment: ['fill', 'top'], \
        }, \
        grLine: Group { \
          orientation: 'column', \
          alignment: 'fill', \
        }, \
        grBindings: Group {\
          spacing: 0, \
          alignment: 'fill', \
          orientation: 'column', \
        }, \
        grAdd: Group { \
          orientation: 'column', \
          alignment: 'fill', \
          alignChildren: 'left', \
          margins: 5, \
          btnAdd: Button { \
            text: '+', \
            preferredSize: [-1, 20], \
            helpTip: 'Add key bind', \
          }, \
        }, \
      }, \
      grButtons: Group { \
        alignChildren: ['right', 'center'], \
        btnSave: Button { text: 'Save' }, \
        btnCancel: Button { text: 'Cancel' }, \
      }, \
    }",
  );

  var pnlKeyBindings = this.element.gr.pnlKeyBindings;
  var grBindings = pnlKeyBindings.grBindings;
  var keyBindings = JSON.parse(preferences.keyBindings);

  pnlKeyBindings.grColumnNames.columnNames = new ColumnNames(
    pnlKeyBindings.grColumnNames,
  );

  // check if plug-in is available
  this.setPluginStatus();

  if (keyBindings && keyBindings.length > 0) {
    for (var i = 0; i < keyBindings.length; i++) {
      if (!keyBindings[i].keyCodes) {
        continue;
      }

      this.keyBindingsArr.push(new KeyBinding(grBindings, keyBindings[i]));
      this.linesArr.push(new Line(grBindings));
    }
  }

  Line(pnlKeyBindings.grLine);

  pnlKeyBindings.grAdd.btnAdd.onClick = bind(function () {
    this.keyCaptureWindow = new KeyCapture(
      this,
      bind(function (keyNames, keyCodes) {
        this.keyBindingsArr.push(
          new KeyBinding(grBindings, {
            enabled: true,
            keyCodes: keyCodes,
            action: 0,
            amount: 1,
          }),
        );

        this.linesArr.push(new Line(grBindings));
      }, this),
    );

    thisWindow.element.layout.layout(true);
  }, this);

  /** Save the key bindings to the AE's settings file */
  this.element.gr.grButtons.btnSave.onClick = bind(function () {
    var bindingsArr = [];
    var bindingElements = grBindings.children;

    for (var i = 0; i < bindingElements.length; i++) {
      // skip lines
      if (i % 2) {
        continue;
      }

      var bEl = bindingElements[i];

      bindingsArr.push({
        enabled: bEl.chkEnable.value,
        keyCodes: bEl.gr.grKeys.keyCombination.keyCodes,
        action: bEl.gr.ddlistAction.selection.index,
        amount: bEl.gr.grAmount.numberValue.getValue(),
      });
    }

    preferences.save("keyBindings", JSON.stringify(bindingsArr));

    /** Tell the plugin to update key bindings info */
    if (this.pluginFound) {
      app.executeCommand($.global.__zoom_plugin_cmd_ids__.updateKeyBindsCmdId);
    }

    /** close the plugin window */
    this.element.close();
  }, this);

  /** Cancel */
  this.element.gr.grButtons.btnCancel.onClick = function () {
    this.window.close();
  };

  this.element.layout.layout(true);
}

PluginWindow.prototype.setPluginStatus = function () {
  var pnlInstallPlugin = this.element.gr.pnlInstallPlugin;

  pnlInstallPlugin.grStatus = pnlInstallPlugin.add(
    "Group {\
      spacing: 6, \
      foldIcon: Custom { preferredSize: [8, 8] }, \
      txt: StaticText {}, \
      statusIcon: Group { preferredSize: [8, 8] }, \
    }",
  );

  var grStatus = pnlInstallPlugin.grStatus;
  var foldIcon = grStatus.foldIcon;
  var statusIcon = grStatus.statusIcon;

  pnlInstallPlugin.graphics.backgroundColor =
    pnlInstallPlugin.graphics.newBrush(
      pnlInstallPlugin.graphics.BrushType.SOLID_COLOR,
      this.pluginFound ? [0.12, 0.2, 0.12, 1] : [0.2, 0.12, 0.12, 1],
    );

  grStatus.txt.text = this.pluginFound
    ? "Zoom plug-in installed"
    : "Zoom plug-in is not installed";

  grStatus.addEventListener(
    "click",
    bind(function (event) {
      if (event.eventPhase === "target") {
        if (this.isUnfoldInfo) {
          this.foldInfo();
          this.isUnfoldInfo = false;
        } else {
          this.unfoldInfo();
          this.isUnfoldInfo = true;
        }

        foldIcon.notify("onDraw");
      }
    }, this),
  );

  foldIcon.onDraw = bind(function () {
    var g = grStatus.foldIcon.graphics;
    var c = grStatus.isMouseOver
      ? [0.75, 0.75, 0.75, 1]
      : [0.55, 0.55, 0.55, 1];
    var b = g.newPen(g.PenType.SOLID_COLOR, c, 2);

    if (this.isUnfoldInfo) {
      g.moveTo(0, 2);
      g.lineTo(4, 6);
      g.lineTo(8, 2);
    } else {
      g.moveTo(0, 0);
      g.lineTo(4, 4);
      g.lineTo(0, 8);
    }

    g.strokePath(b);
  }, this);

  grStatus.addEventListener("mouseover", function (event) {
    if (event.eventPhase === "target") {
      grStatus.isMouseOver = true;
      foldIcon.notify("onDraw");
    }
  });

  grStatus.addEventListener("mouseout", function (event) {
    if (event.eventPhase === "target") {
      grStatus.isMouseOver = false;
      foldIcon.notify("onDraw");
    }
  });

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

  if (this.isUnfoldInfo) {
    this.unfoldInfo();
  }
};

PluginWindow.prototype.unfoldInfo = function () {
  var grInfo = this.element.gr.pnlInstallPlugin.add(
    "Group { \
        orientation: 'column', \
        alignChildren: ['left', 'center'], \
        grLine: Group { alignment: 'fill', orientation: 'column' }, \
        txt0: StaticText { text: 'To use key bindings, you must first install Zoom plug-in.' }, \
        grSave: Group { \
          margins: [0, 10, 0, 10], \
          alignment: ['fill', 'bottom'], \
          alignChildren: ['center', 'center'], \
          btnSaveWin: Button { text: 'Save Plug-in (Windows)' }, \
          btnSaveMac: Button { text: 'Save Plug-in (macOS)' }, \
        }, \
        txt1: StaticText { text: '1. Click on \"Save Plug-in\" for your platform.' }, \
        txt2: StaticText { text: '2. Save the plug-in somewhere on your disk.' }, \
        txt3: StaticText { text: '3. Copy the saved file to:' }, \
        grWin: Group { \
          grSpace: Group { size: [6, 1] }, \
          txtWin: StaticText { text: 'Windows:' }, \
          alignment: ['fill', 'center' ], \
          txtPath: EditText { \
            text: 'C:/Program Files/Adobe/Adobe After Effects [version]/Support Files/Plug-ins/', \
            alignment: ['fill', 'center' ], \
            properties: { readonly: true }, \
          }, \
        }, \
        grMac: Group { \
          grSpace: Group { size: [6, 1] }, \
          txtMac: StaticText { text: 'macOS:' }, \
          alignment: ['fill', 'center' ], \
          txtPath: EditText { \
            text: '/Applications/Adobe After Effects [version]/Plug-ins/', \
            alignment: ['fill', 'center' ], \
            properties: { readonly: true }, \
          }, \
        }, \
        txt4: StaticText { text: '4. Restart After Effects.' }, \
      }",
  );

  this.element.gr.pnlInstallPlugin.grInfo = grInfo;

  var os = checkOs();
  var currentFolder = Folder.current;

  if (currentFolder) {
    var pluginsFolderArr = currentFolder.getFiles("Plug-ins");

    if (pluginsFolderArr && pluginsFolderArr.length) {
      if (os === OS.WIN) {
        var fp = decodeURI(pluginsFolderArr[0].absoluteURI).slice(1);
        fp = fp.charAt(0).toUpperCase() + ":" + fp.slice(1) + "/";

        grInfo.grWin.txtPath.text = fp;
      } else if (os === OS.MAC) {
        grInfo.grMac.txtPath.text =
          decodeURI(pluginsFolderArr[0].absoluteURI) + "/";
      }
    }
  }

  var txtMac = grInfo.grMac.txtMac;
  var g = txtMac.graphics;
  txtMac.size = g.measureString("Windows:");

  grInfo.grSave.btnSaveWin.onClick = function () {
    saveFileFromBinaryString(zoomPluginBin);
  };

  Line(grInfo.grLine);

  this.element.layout.layout(true);
};

PluginWindow.prototype.foldInfo = function () {
  var grInfo = this.element.gr.pnlInstallPlugin.grInfo;

  if (grInfo && isValid(grInfo)) {
    grInfo.parent.remove(grInfo);
  }

  this.element.layout.layout(true);
  this.element.layout.resize();
};

export default PluginWindow;
