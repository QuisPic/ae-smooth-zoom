import preferences from "../../preferences";
import zoomPlugin from "../../zoomPlugin";
import PluginStatusWithButton from "../status/plugin-status-with-button";
import { DEFAULT_SETTINGS, ZOOM_PLUGIN_STATUS } from "../../constants";
import bind from "../../../extern/function-bind";
import Checkbox from "../checkbox";
import windows from "../../windows";
import AboutWindow from "../about-window";

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
        pnlWarning: Panel { \
          alignChildren: 'left', \
          spacing: 1, \
          txt0: StaticText {}, \
          txt1: StaticText {}, \
          txt2: StaticText {}, \
          grButtons: Group { \
            margins: [0, 10, 0, 0], \
            alignment: 'right', \
            btnReset: IconButton { \
              title: 'Reset Experimental Settings', \
              preferredSize: [-1, 22], \
            }, \
            btnContacts: IconButton { \
              title: 'Contacts', \
              preferredSize: [-1, 22], \
            }, \
          }, \
        }, \
      }, \
    }",
  );

  var pnlDetectCursorInsideView = this.element.gr.pnlDetectCursorInsideView;
  var pnlFixViewportPosition = this.element.gr.pnlFixViewportPosition;
  var pnlWarning = this.element.gr.pnlWarning;

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

  this.readSettingsFrom(preferences.experimental);

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

  pnlWarning.txt0.text = "Please note that these settings are experimental.";
  pnlWarning.txt1.text =
    "Experimental settings may not work as described or may even cause After Effects to crash.";
  pnlWarning.txt2.text =
    "If you experience such issues, please report to the author.";

  pnlWarning.grButtons.btnContacts.onClick = function () {
    windows.new(AboutWindow);
  };

  pnlWarning.grButtons.btnReset.onClick = bind(function () {
    this.readSettingsFrom(DEFAULT_SETTINGS.experimental);
    this.saveAll();
  }, this);

  pnlWarning.graphics.backgroundColor = this.element.graphics.newBrush(
    this.element.graphics.BrushType.SOLID_COLOR,
    [0.19, 0.19, 0, 1],
  );
}

ExperimentalSettings.prototype.readSettingsFrom = function (settingsObj) {
  var pnlDetectCursorInsideView = this.element.gr.pnlDetectCursorInsideView;
  var pnlFixViewportPosition = this.element.gr.pnlFixViewportPosition;

  pnlDetectCursorInsideView.grCheck.setValue(
    settingsObj.detectCursorInsideView,
  );

  pnlFixViewportPosition.grCheck.setValue(
    settingsObj.fixViewportPosition.enabled,
  );

  pnlFixViewportPosition.pnlZoomAround.grZoomAround.ddlistZoomPoint.selection =
    settingsObj.fixViewportPosition.zoomAround;

  pnlFixViewportPosition.pnlZoomAround.enabled =
    settingsObj.fixViewportPosition.enabled;
};

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
