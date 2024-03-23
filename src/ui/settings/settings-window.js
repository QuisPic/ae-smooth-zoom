import bind from "../../../extern/function-bind";
import ExperimentalSettings from "./experimental-settings";
import GeneralSettings from "./general-settings";
import KeyBindingsSettings from "./key-bindings/key-bindings-settings";
import PluginSettings from "./plug-in-settings";

function SettingsWindow(zoom) {
  this.saveOnClose = false;

  this.element = new Window(
    "palette { \
      margins: 0, \
      spacing: 0, \
    }",
    "Zoom Settings",
    undefined,
  );

  var tabs = this.element.add(
    "tabbedpanel { \
      properties: { name: 'tabs' }, \
      alignment: ['fill', 'fill'], \
      minimumSize: [560, 350], \
    }",
  );

  tabs.general = new GeneralSettings(tabs, zoom);
  tabs.plugin = new PluginSettings(tabs);
  tabs.keyBindings = new KeyBindingsSettings(tabs);
  tabs.experimentalSettings = new ExperimentalSettings(tabs);

  this.tabsArr = [
    tabs.general,
    tabs.plugin,
    tabs.keyBindings,
    tabs.experimentalSettings,
  ];

  /** Draw Key Bindings tab only when it's selected because it takes too long to draw */
  tabs.onChange = function () {
    if (this.selection === tabs.keyBindings.element) {
      this.keyBindings.draw();
    }
  };

  this.element.grButtons = this.element.add(
    "Group { \
      alignment: ['fill', 'bottom'], \
      margins: 10, \
      alignChildren: ['right', 'center'], \
      btnSave: IconButton { title: 'OK', preferredSize: [100, 22] }, \
      btnCancel: IconButton { title: 'Cancel', preferredSize: [100, 22] }, \
    }",
  );

  this.element.grButtons.btnSave.onClick = bind(function () {
    this.saveOnClose = true;

    /** Close the window */
    this.element.close();
  }, this);

  this.element.grButtons.btnCancel.onClick = bind(function () {
    /** Close the window */
    this.element.close();
  }, this);

  this.element.onClose = bind(function () {
    if (this.saveOnClose) {
      this.saveChanges();
    } else {
      this.cancelChanges();
    }
  }, this);

  // this.element.layout.layout(true);
  this.element.show();
}

SettingsWindow.prototype.saveChanges = function () {
  for (var i = 0; i < this.tabsArr.length; i++) {
    if (typeof this.tabsArr[i].save === "function") {
      this.tabsArr[i].save();
    }
  }
};

SettingsWindow.prototype.cancelChanges = function () {
  for (var i = 0; i < this.tabsArr.length; i++) {
    if (typeof this.tabsArr[i].cancel === "function") {
      this.tabsArr[i].cancel();
    }
  }
};

export default SettingsWindow;
