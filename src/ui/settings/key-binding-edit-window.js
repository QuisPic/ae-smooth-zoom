import zoomPlugin from "../../zoomPlugin";
import NumberValue from "../number-value";
import KeyCombination from "./key-bindings/key-combination";
import {
  EVENT_KEY_PRESSED,
  VC_ENTER,
  VC_ESCAPE,
  VC_EX_ENTER,
} from "../../constants";
import bind from "../../../extern/function-bind";

function KeyBindingEditWindow(values) {
  if (!zoomPlugin.isAvailable()) {
    alert(
      "Zoom plug-in is not found.\nPlease install Zoom plug-in to use key bindings.",
    );
    return;
  }

  this.keyCodes = values.keyCodes;

  this.element = new Window(
    "palette { \
      properties: { \
        resizeable: false, \
      }, \
      alignChildren: ['fill', 'top'], \
      pnlKeyCapture: Panel { \
        alignChildren: ['center', 'center'], \
        txt0: StaticText { \
          text: 'Click on element below to change key combination.', \
        }, \
        pnlCapture: Panel { \
          alignment: ['fill', 'center'], \
          alignChildren: ['fill', 'fill'], \
        }, \
        grBottomText : Group { \
          spacing: 4, \
          visible: false, \
          txt0: StaticText { text: 'Press' }, \
          grEnter: Group {}, \
          txt1: StaticText { text: 'to accept.' }, \
          grEscape: Group {}, \
          txt2: StaticText { text: 'to cancel.' }, \
        }, \
      }, \
      pnlAction: Panel { \
        orientation: 'row', \
        grAction: Group { \
          spacing: 4, \
          txt: StaticText { text: 'Action:' }, \
          ddlistAction: DropDownList { \
            properties: { \
              items: ['[+] Add', '[-] Subtract', '[=] Set To'] \
            }, \
          }, \
        }, \
        grAmount: Group { \
          alignment: ['right', 'center'], \
          spacing: 4, \
          txt: StaticText { text: 'Amount:' }, \
        }, \
      }, \
      grButtons: Group { \
        alignment: ['fill', 'bottom'], \
        margins: 10, \
        alignChildren: ['right', 'center'], \
        btnSave: IconButton { title: 'OK', preferredSize: [100, 22] }, \
        btnCancel: IconButton { title: 'Cancel', preferredSize: [100, 22] }, \
      }, \
    }",
  );

  var pnlKeyCapture = this.element.pnlKeyCapture;
  pnlKeyCapture.grBottomText.grEnter.keyCombination = new KeyCombination(
    pnlKeyCapture.grBottomText.grEnter,
    ["Enter"],
  );
  pnlKeyCapture.grBottomText.grEscape.keyCombination = new KeyCombination(
    pnlKeyCapture.grBottomText.grEscape,
    ["Escape"],
  );

  this.keyCombination = new KeyCombination(
    pnlKeyCapture.pnlCapture,
    [],
    undefined,
    "center",
  );
  this.keyCombination.updateKeysWithCodes(values.keyCodes);

  pnlKeyCapture.layout.layout(true);
  pnlKeyCapture.pnlCapture.minimumSize = pnlKeyCapture.pnlCapture.size;

  pnlKeyCapture.pnlCapture.addEventListener(
    "click",
    bind(function () {
      this.startKeyCapture();
    }, this),
  );

  var grAmount = this.element.pnlAction.grAmount;
  grAmount.numberValue = new NumberValue(
    grAmount,
    "%",
    undefined,
    0,
    undefined,
    undefined,
    undefined,
    // onChangeFn,
  );

  if (values) {
    this.element.pnlAction.grAction.ddlistAction.selection = values.action;
    grAmount.numberValue.setValue(values.amount);
  }

  /** Put a link to this object in global scope so we can access it from the plug-in */
  $.global.__zoom_key_capture_object__ = this;

  this.element.onClose = bind(function () {
    this.endKeyCapture();
  }, this);

  /** Tell the plugin to start key capture */
  // this.startKeyCapture();

  this.element.show();
}

KeyBindingEditWindow.prototype.startKeyCapture = function () {
  if (zoomPlugin.isAvailable()) {
    try {
      zoomPlugin.startKeyCapture();
      this.element.pnlKeyCapture.txt0.text =
        "Press desired key combination. You can use keyboard and mouse.";
      this.element.pnlKeyCapture.grBottomText.show();
      this.element.layout.layout(true);
    } catch (error) {
      alert("Error at line " + $.line + ":\n" + error.message);
    }
  }
};

KeyBindingEditWindow.prototype.endKeyCapture = function () {
  if (zoomPlugin.isAvailable()) {
    try {
      zoomPlugin.endKeyCapture();
      this.element.pnlKeyCapture.txt0.text =
        "Click on element below to change key combination.";
      this.element.pnlKeyCapture.grBottomText.hide();
      this.element.layout.layout(true);
    } catch (error) {
      alert("Error at line " + error.line + ":\n" + error.message);
    }
  }
};

/**
 * This function is called from the zoom plugin.
 * It receives currently pressed keyboard and mouse keys in the plugin format
 * and translates them into readable format.
 * @param { number } type type of the event: KEY_PRESSED, MOUSE_PRESSED, SCROLL_WHEEL
 * @param { number } mask the modifier keys that were pressed at the time of the event: Ctrl, Win/Cmd, Shift, Alt/Option
 * @param { number } key the key code of the button that was pressed: keyboard or mouse button or mouse wheel direction
 */
KeyBindingEditWindow.prototype.passFn = function (type, mask, keycode) {
  if (
    type === EVENT_KEY_PRESSED &&
    (keycode === VC_ENTER || keycode === VC_EX_ENTER)
  ) {
    //   if (
    //     this.keyCombination.keyNames.length > 0 &&
    //     typeof this.onEnterKeyFn === "function"
    //   ) {
    //     try {
    //       this.onEnterKeyFn(
    //         this.keyCombination.keyNames,
    //         this.keyCombination.keyCodes,
    //       );
    //     } catch (error) {
    //       alert("Error at line " + error.line + ":\n" + error.message);
    //     }
    //   }

    this.endKeyCapture();
    this.keyCodes = this.keyCombination.keyCodes;
  } else if (type === EVENT_KEY_PRESSED && keycode === VC_ESCAPE) {
    // this.element.close();

    this.endKeyCapture();
    this.keyCombination.updateKeysWithCodes(this.keyCodes);
    this.element.layout.layout(true);
  } else {
    this.keyCombination.updateKeysWithCodes({
      type: type,
      mask: mask,
      keycode: keycode,
    });

    this.element.layout.layout(true);
  }
};

export default KeyBindingEditWindow;
