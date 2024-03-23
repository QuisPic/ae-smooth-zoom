import preferences from "../../preferences";
import JSON from "../../../extern/json2";
import zoomPlugin from "../../zoomPlugin";
import PluginStatusWithButton from "../status/plugin-status-with-button";
import { ZOOM_PLUGIN_STATUS } from "../../constants";
import bind from "../../../extern/function-bind";
import Checkbox from "../checkbox";
import ExperimentalSettingsWarning from "./experimental-settings-warning";

function ExperimentalSettings(parentEl) {
  this.settingsOnStart = preferences.experimental;

  this.element = parentEl.add(
    "tab { \
      text: 'Experimental', \
      alignChildren: ['left', 'top'], \
      orientation: 'row', \
      margins: [12, 10, 0, 10], \
      gr: Group { \
        orientation: 'column', \
        alignment: ['fill', 'fill'], \
        alignChildren: 'fill', \
        grPluginStatus: Group { \
          alignChildren: ['fill', 'top'], \
        }, \
        pnlFixViewportPosition: Panel { \
          orientation: 'column', \
          alignChildren: 'left', \
          grCheck: Group {}, \
          txtDescription: StaticText {\
            text: 'Enabling this option fixes the automatic centering of the composition view when zoom is changed.', \
          },\
          pnlZoomAround: Panel { \
            alignment: 'fill', \
            alignChildren: 'left', \
            text: 'Mouse Wheel', \
            grZoomAround: Group { \
              txtZoomAround: StaticText {\
                text: 'When using mouse wheel, change zoom relative to: ', \
              }, \
              ddlistZoomPoint: DropDownList { \
                properties: { \
                  items: ['View Panel Center (AE default)', 'Cursor Position'],\
                }, \
              }, \
            }, \
          }, \
        }, \
        pnlDetectCursorInsideView: Panel { \
          orientation: 'column', \
          alignChildren: 'left', \
          grCheck: Group {}, \
          txtDescription: StaticText { \
            text: 'If enabled, Zoom key bindings that include mouse events will be captured only when the mouse cursor is inside a viewport. If multiple viewports are open, Zoom will target the viewport currently under the mouse cursor.', \
            characters: 55, \
            properties: { multiline: true }, \
          },\
        }, \
      }, \
    }",
  );

  var pnlDetectCursorInsideView = this.element.gr.pnlDetectCursorInsideView;
  var pnlFixViewportPosition = this.element.gr.pnlFixViewportPosition;

  pnlDetectCursorInsideView.grCheck = new Checkbox(
    pnlDetectCursorInsideView,
    "Change zoom only when cursor is inside a viewport",
    pnlDetectCursorInsideView.grCheck,
  );

  pnlFixViewportPosition.grCheck = new Checkbox(
    pnlFixViewportPosition,
    "Maintain View position after zooming",
    pnlFixViewportPosition.grCheck,
  );

  pnlDetectCursorInsideView.grCheck.setValue(
    preferences.experimental.detectCursorInsideView,
  );

  pnlFixViewportPosition.grCheck.setValue(
    preferences.experimental.fixViewportPosition.enabled,
  );

  pnlFixViewportPosition.pnlZoomAround.grZoomAround.ddlistZoomPoint.selection =
    preferences.experimental.fixViewportPosition.zoomAround;

  pnlFixViewportPosition.pnlZoomAround.enabled =
    preferences.experimental.fixViewportPosition.enabled;

  /** Show plug-in status if plug-in is not found */
  if (zoomPlugin.status() !== ZOOM_PLUGIN_STATUS.INITIALIZED) {
    this.addStatus();
  } else {
    this.deleteStatus();
  }

  pnlDetectCursorInsideView.grCheck.setOnClick(bind(this.saveAll, this));

  pnlFixViewportPosition.grCheck.setOnClick(
    bind(function () {
      var pnlFixViewportPosition = this.element.gr.pnlFixViewportPosition;

      pnlFixViewportPosition.pnlZoomAround.enabled =
        pnlFixViewportPosition.grCheck.element.check.value;

      this.saveAll();
    }, this),
  );

  pnlFixViewportPosition.pnlZoomAround.grZoomAround.ddlistZoomPoint.onChange =
    bind(this.saveAll, this);

  this.element.gr.warning = new ExperimentalSettingsWarning(this.element.gr);
}

ExperimentalSettings.prototype.addStatus = function () {
  var grPluginStatus = this.element.gr.grPluginStatus;
  grPluginStatus.pluginStatusPanel = new PluginStatusWithButton(grPluginStatus);

  var grText = grPluginStatus.pluginStatusPanel.element.grStatus.gr.grText;
  var statusText = grText.children[0].text;

  grText.children[0].text = "Experimental settings are not available:";
  grText.add("StaticText { text: '" + statusText + "' }");

  this.element.gr.pnlDetectCursorInsideView.enabled = false;
  this.element.gr.pnlFixViewportPosition.enabled = false;
};

ExperimentalSettings.prototype.deleteStatus = function () {
  if (this.element.gr.grPluginStatus) {
    this.element.gr.remove(this.element.gr.grPluginStatus);
    this.element.gr.grPluginStatus = undefined;
  }
};

ExperimentalSettings.prototype.reloadStatus = function () {
  if (this.element.gr.grPluginStatus) {
    var pluginStatusPanel = this.element.gr.grPluginStatus.pluginStatusPanel;

    if (pluginStatusPanel) {
      var statusChanged = pluginStatusPanel.setPluginStatus();

      if (statusChanged) {
        if (pluginStatusPanel.pluginStatus === ZOOM_PLUGIN_STATUS.INITIALIZED) {
          this.deleteStatus();
          this.element.gr.pnlDetectCursorInsideView.enabled = true;
          this.element.gr.pnlFixViewportPosition.enabled = true;
        }

        this.element.layout.layout(true);
        this.element.layout.resize();
      }
    }
  }
};

ExperimentalSettings.prototype.saveAll = function () {
  preferences.save("experimental", {
    detectCursorInsideView:
      this.element.gr.pnlDetectCursorInsideView.grCheck.element.check.value,
    fixViewportPosition: {
      enabled:
        this.element.gr.pnlFixViewportPosition.grCheck.element.check.value,
      zoomAround:
        this.element.gr.pnlFixViewportPosition.pnlZoomAround.grZoomAround
          .ddlistZoomPoint.selection.index,
    },
  });
};

ExperimentalSettings.prototype.cancel = function () {
  if (this.settingsOnStart !== preferences.experimental) {
    preferences.save("experimental", this.settingsOnStart);
  }
};

export default ExperimentalSettings;
