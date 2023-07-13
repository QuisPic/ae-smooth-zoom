import { checkOs, saveFileFromBinaryString } from "../utils";
import zoomPluginBin from "../../extern/zoom-plugin";
import { OS, SETTINGS_SECTION_NAME } from "../constants";
import Settings from "./settings";
import KeyBinding from "./key-binding";
import Line from "./line";
import TrashIcon from "./trash-icon";
import JSON from "../../extern/json2";

function PluginWindow() {
  var thisWindow = this;

  this.element = new Window("palette", "Zoom Key Bindings", undefined, {
    resizeable: false,
  });

  this.element.onResize = function () {
    thisWindow.placeColumnNames();
    this.layout.resize();
  };

  this.element.onResizing = this.element.onResize;
  this.element.alignChildren = ["center", "center"];

  this.element.gr = this.element.add(
    "Group { \
      orientation: 'column', \
      alignChildren: ['fill', 'center'], \
      pnlInstallPlugin: Panel { \
        alignChildren: 'left', \
      }, \
      pnlKeyBindings: Panel { \
        alignment: 'fill', \
        orientation: 'column', \
        margins: 0, \
        spacing: 0, \
        grColumnNames: Group { \
          alignment: ['fill', 'top'], \
          cCheck: Custom { preferredSize: [8, 8] }, \
          grLine0: Group { alignment: 'fill' }, \
          txtKeyboard: StaticText { text: 'Key' }, \
          grLine1: Group { alignment: 'fill' }, \
          txtMouse: StaticText { text: 'Mouse' }, \
          grLine2: Group { alignment: 'fill' }, \
          txtAction: StaticText { text: 'Action' }, \
          grLine3: Group { alignment: 'fill' }, \
          txtAmount: StaticText { text: '%' }, \
          grLine4: Group { alignment: 'fill' }, \
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

  var pnlInstallPlugin = this.element.gr.pnlInstallPlugin;
  var pnlKeyBindings = this.element.gr.pnlKeyBindings;
  var grBindings = pnlKeyBindings.grBindings;
  var grColumnNames = pnlKeyBindings.grColumnNames;
  var keyBindings = JSON.parse(Settings.getSettings().keyBindings);

  pnlInstallPlugin.graphics.backgroundColor =
    pnlInstallPlugin.graphics.newBrush(
      pnlInstallPlugin.graphics.BrushType.SOLID_COLOR,
      [0.2, 0.12, 0.12, 1],
    );

  this.setStatus();

  grColumnNames.trashIcon = new TrashIcon(grColumnNames, false);

  if (keyBindings && keyBindings.length > 0) {
    for (var i = 0; i < keyBindings.length; i++) {
      KeyBinding(grBindings, keyBindings[i]);
      Line(grBindings);
    }
  }

  Line(grColumnNames.grLine0);
  Line(grColumnNames.grLine1);
  Line(grColumnNames.grLine2);
  Line(grColumnNames.grLine3);
  Line(grColumnNames.grLine4);

  Line(pnlKeyBindings.grLine);

  if (Settings.getSettings().unfoldInfo) {
    this.unfoldInfo();
  }

  pnlKeyBindings.grAdd.btnAdd.onClick = function () {
    KeyBinding(grBindings);
    Line(grBindings);

    thisWindow.element.layout.layout(true);
  };

  this.element.gr.grButtons.btnSave.onClick = function () {
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
        key: bEl.gr.ddlistKeys.selection.index,
        mouse: bEl.gr.ddlistMouse.selection.index,
        action: bEl.gr.ddlistAction.selection.index,
        amount: bEl.gr.amount.getValue(),
      });

      app.settings.saveSetting(
        SETTINGS_SECTION_NAME,
        "keyBindings",
        JSON.stringify(bindingsArr),
      );

      this.window.close();
    }
  };

  this.element.gr.grButtons.btnCancel.onClick = function () {
    this.window.close();
  };

  this.element.layout.layout(true);
  this.placeColumnNames();
}

PluginWindow.prototype.setStatus = function () {
  var pnlInstallPlugin = this.element.gr.pnlInstallPlugin;

  var grStatus = pnlInstallPlugin.add(
    "Group {\
      spacing: 6, \
      foldIcon: Custom { preferredSize: [8, 8] }, \
      txt: StaticText { text: 'Zoom plug-in is not installed' }, \
      statusIcon: Group { preferredSize: [8, 8] }, \
    }",
  );

  var foldIcon = grStatus.foldIcon;
  var statusIcon = grStatus.statusIcon;
  var pluginWindow = this;

  foldIcon.unfoldInfo = Settings.getSettings().unfoldInfo;

  grStatus.addEventListener("click", function (event) {
    if (event.eventPhase === "target") {
      var unfoldInfo = Settings.getSettings().unfoldInfo;

      if (unfoldInfo) {
        pluginWindow.foldInfo();
      } else {
        pluginWindow.unfoldInfo();
      }

      app.settings.saveSetting(
        SETTINGS_SECTION_NAME,
        "unfoldInfo",
        !unfoldInfo,
      );

      foldIcon.unfoldInfo = !unfoldInfo;
      foldIcon.notify("onDraw");
    }
  });

  foldIcon.onDraw = function () {
    var g = this.graphics;
    var c = grStatus.isMouseOver
      ? [0.75, 0.75, 0.75, 1]
      : [0.55, 0.55, 0.55, 1];
    var b = g.newPen(g.PenType.SOLID_COLOR, c, 2);

    if (this.unfoldInfo) {
      g.moveTo(0, 2);
      g.lineTo(4, 6);
      g.lineTo(8, 2);
    } else {
      g.moveTo(0, 0);
      g.lineTo(4, 4);
      g.lineTo(0, 8);
    }

    g.strokePath(b);
  };

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

  statusIcon.onDraw = function () {
    var g = this.graphics;
    var c = [1, 0, 0, 1];
    var p = g.newPen(g.PenType.SOLID_COLOR, c, 2);

    g.moveTo(0, 0);
    g.lineTo(8, 8);
    g.strokePath(p);

    g.currentPath = g.newPath();

    g.moveTo(8, 0);
    g.lineTo(0, 8);
    g.strokePath(p);
  };
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
            properties: { readonly: true, borderless: true }, \
          }, \
        }, \
        grMac: Group { \
          grSpace: Group { size: [6, 1] }, \
          txtMac: StaticText { text: 'macOS:' }, \
          alignment: ['fill', 'center' ], \
          txtPath: EditText { \
            text: '/Applications/Adobe After Effects [version]/Plug-ins/', \
            alignment: ['fill', 'center' ], \
            properties: { readonly: true, borderless: true }, \
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

PluginWindow.prototype.placeColumnNames = function () {
  var pnlKeyBindings = this.element.gr.pnlKeyBindings;
  var grColumnNames = pnlKeyBindings.grColumnNames;
  var grBindings = pnlKeyBindings.grBindings;
  // var keyBind = this.keyBindElements[0];
  var keyBind = grBindings.children[0];

  var cCheck = grColumnNames.cCheck;
  var txtKeyboard = grColumnNames.txtKeyboard;
  var txtMouse = grColumnNames.txtMouse;
  var txtAction = grColumnNames.txtAction;
  var txtAmount = grColumnNames.txtAmount;
  var trashIcon = grColumnNames.trashIcon.element;

  var grLine0 = grColumnNames.grLine0;
  var grLine1 = grColumnNames.grLine1;
  var grLine2 = grColumnNames.grLine2;
  var grLine3 = grColumnNames.grLine3;
  var grLine4 = grColumnNames.grLine4;

  if (!keyBind.size) {
    this.element.layout.layout(true);
  }

  var chkEnable = keyBind.chkEnable;
  var gr = keyBind.gr;
  var ddlistKeys = gr.ddlistKeys;
  var ddlistMouse = gr.ddlistMouse;
  var ddlistAction = gr.ddlistAction;
  var amount = gr.amount.element;
  var trash = keyBind.trash.element;

  cCheck.onDraw = function () {
    var g = this.graphics;
    var c = [0.55, 0.55, 0.55, 1];
    var p = g.newPen(g.PenType.SOLID_COLOR, c, 2);

    g.moveTo(0, 3);
    g.lineTo(3, 6);
    g.lineTo(8, 0);
    g.strokePath(p);
  };

  grLine0.location = [gr.location[0] + ddlistKeys.location[0], 0];
  grLine1.location = [gr.location[0] + ddlistMouse.location[0], 0];
  grLine2.location = [gr.location[0] + ddlistAction.location[0], 0];
  grLine3.location = [gr.location[0] + amount.location[0], 0];
  grLine4.location = [gr.location[0] + amount.location[0] + amount.size[0], 0];

  cCheck.location = [chkEnable.location[0] + 3, 5];
  txtKeyboard.location = [grLine0.location[0] + 5, 0];
  txtMouse.location = [grLine1.location[0] + 5, 0];
  txtAction.location = [grLine2.location[0] + 5, 0];
  txtAmount.location = [grLine3.location[0] + 5, 0];
  trashIcon.location = [trash.location[0], 2];
};

export default PluginWindow;
