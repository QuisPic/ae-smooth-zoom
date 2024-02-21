import bind from "../../../extern/function-bind";
import ExperimentalSettings from "./experimental-settings";
import GeneralSettings from "./general-settings";
import KeyBindingsSettings from "./key-bindings/key-bindings-settings";
import PluginSettings from "./plug-in-settings";

function SettingsWindow(zoom) {
  this.element = new Window(
    "palette { \
      margins: 0, \
      spacing: 0, \
    }",
    "Zoom Settings",
    undefined,
  );

  this.element.onResize = bind(function () {
    this.element.layout.resize();
    // var tabs = this.element.tabs;

    // tabs.keyBindings.updateScrollBar();
    // tabs.experimentalSettings.updateScrollBar();
  }, this);

  this.element.onResizing = this.element.onResize;

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

  /** Draw Key Bindings tab only when it's selected because it takes too long to draw */
  tabs.onChange = function () {
    if (this.selection && this.selection.text == "Key Bindings") {
      this.keyBindings.draw();
    }
  };

  this.element.grButtons = this.element.add(
    "Group { \
      alignment: ['fill', 'bottom'], \
      margins: 10, \
      alignChildren: ['right', 'center'], \
      btnSave: IconButton { title: 'Save', preferredSize: [100, 22] }, \
      btnCancel: IconButton { title: 'Cancel', preferredSize: [100, 22] }, \
    }",
  );

  this.element.grButtons.btnSave.onClick = bind(function () {
    preferences.save(
      "experimental",
      JSON.stringify({
        detectCursorInsideView:
          this.element.gr.pnlDetectCursorInsideView.grCheck.chk.value,
        fixViewportPosition: {
          enabled: this.element.gr.pnlFixViewportPosition.grCheck.chk.value,
          zoomAround:
            this.element.gr.pnlFixViewportPosition.grZoomAround.ddlistZoomPoint
              .selection.index,
        },
      }),
    );

    /** Close the window */
    this.element.close();
  }, this);

  this.element.layout.layout(true);
  this.element.show();
}

export default SettingsWindow;
