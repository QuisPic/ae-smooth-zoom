import bind from "../../extern/function-bind";
import preferences from "../preferences";
import JSON from "../../extern/json2";

function ExperimentalWindow() {
  this.element = new Window(
    "palette { \
      properties: { resizeable: false }, \
      preferredSize: [500, -1], \
      alignChildren: 'fill', \
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
          grZoomAround: Group { \
            txtZoomAround: StaticText {\
              text: 'Zoom around: ', \
            }, \
            ddlistZoomPoint: DropDownList { \
              properties: { \
                items: ['View Panel Center (AE default)', 'Cursor Position'],\
              }, \
            }, \
          }, \
          txtDescription: StaticText {\
            text: 'If enabled, the composition view will maintain its position relative to the point selected above after zooming. If disabled, the view will always be centered after zooming.', \
            characters: 50, \
            properties: { multiline: true }, \
          },\
        }, \
      }, \
      grButtons: Group { \
        alignChildren: ['right', 'center'], \
        btnSave: IconButton { title: 'Save', preferredSize: [100, 22] }, \
        btnCancel: IconButton { title: 'Cancel', preferredSize: [100, 22] }, \
      }, \
    }",
    "Zoom Experimental",
    undefined,
  );

  var experimentalPrefs = JSON.parse(preferences.experimental);
  var fixViewportPositionChkGr = this.element.gr.pnlFixViewportPosition.grCheck;
  var detectCursorInsideViewChkGr = this.element.gr.pnlDetectCursorInsideView.grCheck;

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

  detectCursorInsideViewChkGr.chk.value = experimentalPrefs.detectCursorInsideView;

  fixViewportPositionChkGr.chk.value = experimentalPrefs.fixViewportPosition.enabled;
  this.element.gr.pnlFixViewportPosition.grZoomAround.ddlistZoomPoint.selection =
    experimentalPrefs.fixViewportPosition.zoomAround;

  this.element.grButtons.btnSave.onClick = bind(function () {
    preferences.save(
      "experimental",
      JSON.stringify({
        detectCursorInsideView:
          this.element.gr.pnlDetectCursorInsideView.grCheck.chk.value,
        fixViewportPosition: {
          enabled: this.element.gr.pnlFixViewportPosition.grCheck.chk.value,
          zoomAround: this.element.gr.pnlFixViewportPosition.grZoomAround.ddlistZoomPoint.selection.index,
        }
      }),
    );

    /** Close the window */
    this.element.close();
  }, this);

  /** Cancel button */
  this.element.grButtons.btnCancel.onClick = function () {
    this.window.close();
  };

  this.element.show();
}

export default ExperimentalWindow;
