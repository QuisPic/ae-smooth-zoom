import JSON from "../../../../extern/json2";
import preferences from "../../../preferences";
import zoomPlugin from "../../../zoomPlugin";
import { ZOOM_PLUGIN_STATUS } from "../../../constants";
import PluginStatusWithButton from "../../status/plugin-status-with-button";
import KeyBindingsList from "../list/key-bindings-list";

function KeyBindingsSettings(parentEl) {
  this.keyBindingsArr = [];
  this.linesArr = [];
  this.drawn = false;

  this.element = parentEl.add(
    "tab { \
      text: 'Key Bindings', \
      alignChildren: ['left', 'top'], \
      orientation: 'row', \
      margins: [12, 10, 0, 10], \
    }",
  );

  this.settingsOnStart = preferences.keyBindings;
}

KeyBindingsSettings.prototype.draw = function () {
  if (!this.drawn) {
    this.element.gr = this.element.add(
      "Group { \
        alignment: ['fill', 'fill'], \
        alignChildren: ['fill', 'top'], \
        orientation: 'column', \
      }",
    );

    this.element.maximumSize.width = 600;

    /** Show plug-in status if plug-in is not found */
    if (zoomPlugin.status() !== ZOOM_PLUGIN_STATUS.INITIALIZED) {
      this.addStatus();
    }

    this.element.gr.keyBindingsList = new KeyBindingsList(this.element.gr);

    if (zoomPlugin.status() !== ZOOM_PLUGIN_STATUS.INITIALIZED) {
      this.element.gr.keyBindingsList.parentGroup.enabled = false;
    }

    this.element.layout.layout(true);
    this.element.layout.resize();
    this.drawn = true;
  }
};

KeyBindingsSettings.prototype.addStatus = function () {
  this.element.gr.grPluginStatus = this.element.gr.add(
    "Group { \
      alignChildren: ['fill', 'top'], \
    }",
  );

  var grPluginStatus = this.element.gr.grPluginStatus;
  grPluginStatus.pluginStatusPanel = new PluginStatusWithButton(grPluginStatus);

  var grText = grPluginStatus.pluginStatusPanel.element.grStatus.gr.grText;
  var statusText = grText.children[0].text;

  grText.children[0].text = "Key Bindings are not available:";
  grText.add("StaticText { text: '" + statusText + "' }");
};

KeyBindingsSettings.prototype.deleteStatus = function () {
  if (this.element.gr.grPluginStatus) {
    this.element.gr.remove(this.element.gr.grPluginStatus);
    this.element.gr.grPluginStatus = undefined;
  }
};

KeyBindingsSettings.prototype.reloadStatus = function () {
  if (this.element.gr.grPluginStatus) {
    var pluginStatusPanel = this.element.gr.grPluginStatus.pluginStatusPanel;

    if (pluginStatusPanel) {
      var statusChanged = pluginStatusPanel.setPluginStatus();

      if (statusChanged) {
        if (pluginStatusPanel.pluginStatus === ZOOM_PLUGIN_STATUS.INITIALIZED) {
          this.deleteStatus();
          this.element.gr.keyBindingsList.parentGroup.enabled = true;
        }

        this.element.layout.layout(true);
        this.element.layout.resize();
      }
    }
  }
};

/** Save the key bindings to the AE's preferences file */
KeyBindingsSettings.prototype.saveAll = function () {
  if (this.drawn) {
    var bindingsArr = [];

    for (var i = 0; i < this.keyBindingsArr.length; i++) {
      var bEl = this.keyBindingsArr[i].element;

      bindingsArr.push({
        enabled: bEl.chkEnable.value,
        keyCodes: bEl.gr.grKeys.keyCombination.keyCodes,
        action: bEl.gr.ddlistAction.selection.index,
        amount: bEl.gr.grAmount.numberValue.getValue(),
      });
    }

    preferences.save("keyBindings", JSON.stringify(bindingsArr));
  }
};

KeyBindingsSettings.prototype.cancel = function () {
  if (this.drawn && this.settingsOnStart !== preferences.keyBindings) {
    preferences.save("keyBindings", this.settingsOnStart);
  }
};

export default KeyBindingsSettings;
