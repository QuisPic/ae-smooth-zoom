import PluginStatus from "./plugin-status";
import create from "../../../extern/object-create";

function PluginStatusWithButton(parentEl) {
  PluginStatus.call(this, parentEl);
  var grStatus = this.element.grStatus;

  grStatus.btnPluginSettings = grStatus.add(
    "IconButton { \
      alignment: ['right', 'center'], \
      preferredSize: [130, 22], \
      title: 'Plug-in Settings ->', \
    }",
  );

  grStatus.btnPluginSettings.onClick = function () {
    var tabs = this.window.tabs;

    var pluginTab;
    for (var i = 0; i < tabs.children.length; i++) {
      if (tabs.children[i].text === "Plug-in") {
        pluginTab = tabs.children[i];
        break;
      }
    }

    tabs.selection = pluginTab;
  };
}

PluginStatusWithButton.prototype = create(PluginStatus.prototype);

export default PluginStatusWithButton;
