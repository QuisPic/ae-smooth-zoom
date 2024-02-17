import { updateScrollBar } from "../utils";
import preferences from "../preferences";
import JSON from "../../extern/json2";

function ExperimentalSettings(parentEl) {
  this.element = parentEl.add(
    "tab { \
      text: 'Experimental', \
      alignChildren: ['left', 'top'], \
      orientation: 'row', \
      gr: Group { \
        orientation: 'column', \
        alignChildren: 'fill', \
        pnlDetectCursorInsideView: Panel { \
          orientation: 'column', \
          alignChildren: 'left', \
          grCheck: Group { \
            spacing: 2, \
            chk: Checkbox { preferredSize: [-1, 14] }, \
            txt: StaticText { text: 'Zoom only if cursor is inside a viewport' }, \
          }, \
          txtDescription: StaticText { \
            text: 'If enabled, Zoom keybindings that include mouse events will be captured only when the cursor is inside a viewport.', \
            characters: 50, \
            properties: { multiline: true }, \
          },\
        }, \
        pnlFixViewportPosition: Panel { \
          orientation: 'column', \
          alignChildren: 'left', \
          grCheck: Group { \
            spacing: 2, \
            chk: Checkbox { preferredSize: [-1, 14] }, \
            txt: StaticText { text: 'Maintain view position' }, \
          }, \
          txtDescription: StaticText {\
            text: 'If enabled, the composition view will maintain its position relative to the point selected above after zooming. If disabled, the view will always be centered after zooming.', \
            characters: 50, \
            properties: { multiline: true }, \
          },\
          grZoomAround: Group { \
            txtZoomAround: StaticText {\
              text: 'Change zoom relative to: ', \
            }, \
            ddlistZoomPoint: DropDownList { \
              properties: { \
                items: ['View Panel Center (AE default)', 'Cursor Position'],\
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

  detectCursorInsideViewChkGr.chk.value =
    experimentalPrefs.detectCursorInsideView;

  fixViewportPositionChkGr.chk.value =
    experimentalPrefs.fixViewportPosition.enabled;
  this.element.gr.pnlFixViewportPosition.grZoomAround.ddlistZoomPoint.selection =
    experimentalPrefs.fixViewportPosition.zoomAround;

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
