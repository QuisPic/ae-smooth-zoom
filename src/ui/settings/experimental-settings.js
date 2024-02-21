import { updateScrollBar } from "../../utils";
import preferences from "../../preferences";
import JSON from "../../../extern/json2";
import zoomPlugin from "../../zoomPlugin";
import PluginStatusWithButton from "../status/plugin-status-with-button";
import { ZOOM_PLUGIN_STATUS } from "../../constants";
import bind from "../../../extern/function-bind";

function ExperimentalSettings(parentEl) {
  this.element = parentEl.add(
    "tab { \
      text: 'Experimental', \
      alignChildren: ['left', 'top'], \
      orientation: 'row', \
      gr: Group { \
        orientation: 'column', \
        alignment: ['fill', 'fill'], \
        alignChildren: 'fill', \
        grPluginStatus: Group { \
          alignChildren: ['fill', 'top'], \
        }, \
        pnlDetectCursorInsideView: Panel { \
          orientation: 'column', \
          alignChildren: 'left', \
          grCheck: Group { \
            spacing: 2, \
            chk: Checkbox { preferredSize: [-1, 14] }, \
            txt: StaticText { text: 'Change zoom only when cursor is inside a viewport' }, \
          }, \
          txtDescription: StaticText { \
            text: 'If enabled, Zoom key bindings that include mouse events will be captured only when the mouse cursor is inside a viewport. If multiple viewports are open, Zoom will target the viewport currently under the mouse cursor.', \
            characters: 55, \
            properties: { multiline: true }, \
          },\
        }, \
        pnlFixViewportPosition: Panel { \
          orientation: 'column', \
          alignChildren: 'left', \
          grCheck: Group { \
            spacing: 2, \
            chk: Checkbox { preferredSize: [-1, 14] }, \
            txt: StaticText { text: 'Maintain View Position' }, \
          }, \
          txtDescription: StaticText {\
            text: 'If enabled, the composition view will maintain its position after zooming.', \
            characters: 50, \
            properties: { multiline: false }, \
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
      }, \
    }",
  );

  var experimentalPrefs = JSON.parse(preferences.experimental);
  var fixViewportPositionChkGr = this.element.gr.pnlFixViewportPosition.grCheck;
  var detectCursorInsideViewChkGr =
    this.element.gr.pnlDetectCursorInsideView.grCheck;

  /** Make clicks on the text next to a check act as click on the check */
  detectCursorInsideViewChkGr.addEventListener("click", function (event) {
    if (event.eventPhase === "target") {
      this.chk.notify();
    }
  });

  fixViewportPositionChkGr.addEventListener("click", function (event) {
    if (event.eventPhase === "target") {
      this.chk.notify();
    }
  });

  fixViewportPositionChkGr.chk.onClick = bind(function () {
    var pnlFixViewportPosition = this.element.gr.pnlFixViewportPosition;

    pnlFixViewportPosition.pnlZoomAround.enabled =
      pnlFixViewportPosition.grCheck.chk.value;
  }, this);

  detectCursorInsideViewChkGr.chk.value =
    experimentalPrefs.detectCursorInsideView;

  fixViewportPositionChkGr.chk.value =
    experimentalPrefs.fixViewportPosition.enabled;
  this.element.gr.pnlFixViewportPosition.pnlZoomAround.grZoomAround.ddlistZoomPoint.selection =
    experimentalPrefs.fixViewportPosition.zoomAround;

  /** Show plug-in status if plug-in is not found */
  if (zoomPlugin.status() !== ZOOM_PLUGIN_STATUS.INITIALIZED) {
    var grPluginStatus = this.element.gr.grPluginStatus;
    grPluginStatus.pluginStatusPanel = new PluginStatusWithButton(
      grPluginStatus,
    );
  }

  // this.element.grButtons.btnSave.onClick = bind(function () {
  //   preferences.save(
  //     "experimental",
  //     JSON.stringify({
  //       detectCursorInsideView:
  //         this.element.gr.pnlDetectCursorInsideView.grCheck.chk.value,
  //       fixViewportPosition: {
  //         enabled: this.element.gr.pnlFixViewportPosition.grCheck.chk.value,
  //         zoomAround:
  //           this.element.gr.pnlFixViewportPosition.grZoomAround.ddlistZoomPoint
  //             .selection.index,
  //       },
  //     }),
  //   );
  //
  //   /** Close the window */
  //   this.element.close();
  // }, this);

  /** Cancel button */
  // this.element.grButtons.btnCancel.onClick = function () {
  //   this.window.close();
  // };
  //
  // this.element.show();
}

ExperimentalSettings.prototype.updateScrollBar = function () {
  updateScrollBar(this.element.gr, this.element);
  this.element.layout.layout(true);
};

export default ExperimentalSettings;
