import KeyCombination from "./key-combination";
import {
  EVENT_KEY_PRESSED,
  TABLE_SIZES,
  VC_ENTER,
  VC_ESCAPE,
  VC_EX_ENTER,
} from "../../constants";
import zoomPlugin from "../../zoomPlugin";

function KeyCapture(onEnterKeyFn) {
  this.onEnterKeyFn = onEnterKeyFn;

  this.element = new Window(
    "palette { \
      alignChildren: ['center','center'], \
      properties: { \
        borderless: false, \
        resizeable: false, \
      }, \
      gr: Group { \
        orientation: 'column', \
        alignChildren: ['center', 'center'], \
        txt0: StaticText { \
          text: 'Press desired key combination. You can use keyboard and mouse.', \
        }, \
        pnlCapture: Panel { \
          alignChildren: ['fill', 'fill'], \
          preferredSize: [400, 50], \
        }, \
        grBottomText : Group { \
          spacing: 4, \
          txt0: StaticText { text: 'Press' }, \
          grEnter: Group {}, \
          txt1: StaticText { text: 'to accept.' }, \
          grEscape: Group {}, \
          txt2: StaticText { text: 'to cancel.' }, \
        }, \
      }, \
    }",
  );

  var gr = this.element.gr;

  gr.grBottomText.grEnter.keyCombination = new KeyCombination(
    gr.grBottomText.grEnter,
    ["Enter"],
  );
  gr.grBottomText.grEscape.keyCombination = new KeyCombination(
    gr.grBottomText.grEscape,
    ["Escape"],
  );

  var g = this.element.graphics;
  var b = g.newBrush(g.BrushType.SOLID_COLOR, [0.05, 0.05, 0.05, 1]);
  this.element.graphics.backgroundColor = b;

  /** place a temp key to calculate the size of the group */
  this.keyCombination = new KeyCombination(
    gr.pnlCapture,
    ["A"],
    TABLE_SIZES[2],
    "center",
  );

  gr.layout.layout(true);
  gr.pnlCapture.minimumSize = gr.pnlCapture.size;
  this.keyCombination.updateKeys([]); // remove the temp key

  /** Put a link to this object in global scope so we can access it from the plug-in */
  $.global.__zoom_key_capture_object__ = this;

  this.element.onClose = function () {
    if (zoomPlugin.isAvailable()) {
      try {
        zoomPlugin.endKeyCapture();
      } catch (error) {
        alert("Error at line " + error.line + ":\n" + error.message);
      }
    }
  };

  this.element.show();

  /** Tell the plugin to start key capture */
  if (zoomPlugin.isAvailable()) {
    try {
      zoomPlugin.startKeyCapture();
    } catch (error) {
      alert("Error at line " + $.line + ":\n" + error.message);
    }
  }
}

/**
 * This function is called from the zoom plugin.
 * It receives currently pressed keyboard and mouse keys in the plugin format
 * and translates them into readable format.
 * @param { number } type type of the event: KEY_PRESSED, MOUSE_PRESSED, SCROLL_WHEEL
 * @param { number } mask the modifier keys that were pressed at the time of the event: Ctrl, Win/Cmd, Shift, Alt/Option
 * @param { number } key the key code of the button that was pressed: keyboard or mouse button or mouse wheel direction
 */
KeyCapture.prototype.passFn = function (type, mask, keycode) {
  /** If the key is Enter, save the key combination and close the window */
  if (
    type === EVENT_KEY_PRESSED &&
    (keycode === VC_ENTER || keycode === VC_EX_ENTER)
  ) {
    if (
      this.keyCombination.keyNames.length > 0 &&
      typeof this.onEnterKeyFn === "function"
    ) {
      try {
        this.onEnterKeyFn(
          this.keyCombination.keyNames,
          this.keyCombination.keyCodes,
        );
      } catch (error) {
        alert("Error at line " + error.line + ":\n" + error.message);
      }
    }

    this.element.close();
  } else if (type === EVENT_KEY_PRESSED && keycode === VC_ESCAPE) {
    this.element.close();
  } else {
    this.keyCombination.updateKeysWithCodes({
      type: type,
      mask: mask,
      keycode: keycode,
    });

    this.element.layout.layout(true);
  }
};

export default KeyCapture;
