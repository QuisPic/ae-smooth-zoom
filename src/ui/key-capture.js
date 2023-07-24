import KeyCombination from "./key-combination";
import bind from "../../extern/function-bind";
import {
  EVENT_KEY_PRESSED,
  TABLE_SIZES,
  VC_ENTER,
  VC_EX_ENTER,
} from "../constants";

function KeyCapture(keyBinding, onEnterKeyFn) {
  this.keyBinding = keyBinding;
  this.onEnterKeyFn = onEnterKeyFn;

  this.element = new Window(
    "dialog { \
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

  // this.captureWindow = new Window(
  //   "palette { \
  //     margins: 0, \
  //     alignChildren: ['fill','fill'], \
  //     orientation: 'stack', \
  //     opacity: 0.01, \
  //     properties: { \
  //       borderless: true, \
  //     }, \
  //     gr: Slider { minvalue: -100 }, \
  //   }",
  // );

  // var primaryScreen = getPrimaryScreen();
  var gr = this.element.gr;

  gr.grBottomText.grEnter.keyCombination = new KeyCombination(
    gr.grBottomText.grEnter,
    ["Enter"],
  );
  gr.grBottomText.grEscape.keyCombination = new KeyCombination(
    gr.grBottomText.grEscape,
    ["Escape"],
  );

  // this.captureWindow.preferredSize = [
  //   primaryScreen.right,
  //   primaryScreen.bottom,
  // ];

  // remove all drawing for the slider
  // this.captureWindow.gr.onDraw = function () {};

  var g = this.element.graphics;
  var b = g.newBrush(g.BrushType.SOLID_COLOR, [0.05, 0.05, 0.05, 1]);
  this.element.graphics.backgroundColor = b;

  // place temp key to calculate the size for the group
  this.keyCombination = new KeyCombination(
    gr.pnlCapture,
    ["A"],
    TABLE_SIZES[2],
    "center",
  );
  gr.layout.layout(true);
  gr.pnlCapture.minimumSize = gr.pnlCapture.size;
  this.keyCombination.updateKeys([]); // remove the temp key

  /**
   * This function is called from zoom plugin.
   * It receives currently pressed keyboard and mouse keys in the plugin format
   * and translates them into readable format.
   * @param { number } type type of the event: KEY_PRESSED, MOUSE_PRESSED, SCROLL_WHEEL
   * @param { number } mask the modifier keys that were pressed at the time of the event: Ctrl, Meta, Shift, Alt/Option
   * @param { number } key the key code of the button that was pressed: keyboard or mouse button or mouse wheel direction
   */
  $.global.__zoom_key_bind_pass_fn__ = bind(function (type, mask, keycode) {
    /** If the key is Enter then save the key combination and close the window */
    if (
      type === EVENT_KEY_PRESSED &&
      (keycode === VC_ENTER || keycode === VC_EX_ENTER)
    ) {
      if (
        this.keyCombination.keyNames.length > 0 &&
        typeof this.onEnterKeyFn === "function"
      ) {
        this.onEnterKeyFn(
          this.keyCombination.keyNames,
          this.keyCombination.keyCodes,
        );
      }

      this.element.close();
    } else {
      this.keyCombination.updateKeysWithCodes({
        type: type,
        mask: mask,
        keycode: keycode,
      });

      this.element.layout.layout(true);
    }
  }, this);

  if ($.global.__zoom_plugin_cmd_ids__) {
    try {
      app.executeCommand($.global.__zoom_plugin_cmd_ids__.startKeyCaptureCmdId);
    } catch (error) {
      alert("Error at line " + $.line + ":\n" + error.message);
    }
  }

  // this.pressedKeys = [];
  // this.combinationEnded = false;
  // this.isMouseDown = false;

  // var updateKeys = bind(function (keyName) {
  //   if (this.combinationEnded) {
  //     this.pressedKeys = [];
  //     this.combinationEnded = false;
  //   }

  //   if (indexOf(this.pressedKeys, keyName) === -1) {
  //     this.pressedKeys = getPressedKeys(keyName);
  //     this.keyCombination.updateKeys(this.pressedKeys);
  //     this.infoWindow.layout.layout(true);
  //   }
  // }, this);

  // this.captureWindow.addEventListener(
  //   "keydown",
  //   bind(function (event) {
  //     try {
  //       if (event.keyName === "Enter") {
  //         this.keyBinding.updateKeys(this.pressedKeys);
  //         this.captureWindow.close();
  //         // } else if (event.keyName === "Escape") {
  //         //   this.captureWindow.close();
  //       } else {
  //         updateKeys(event.keyName);
  //       }
  //     } catch (error) {
  //       alert(error);
  //     }
  //   }, this),
  // );

  // this.captureWindow.addEventListener(
  //   "keyup",
  //   bind(function () {
  //     try {
  //       var pressedKeys = getPressedKeys();

  //       if (pressedKeys.length === 0) {
  //         this.combinationEnded = true;
  //       }
  //     } catch (error) {
  //       alert(error);
  //     }
  //   }, this),
  // );

  // this.captureWindow.addEventListener(
  //   "mousedown",
  //   bind(function (event) {
  //     try {
  //       event.preventDefault();
  //       this.isMouseDown = true;

  //       switch (event.button) {
  //         case 0:
  //           updateKeys("Left Click");
  //           break;
  //         case 1:
  //           updateKeys("Middle Click");
  //           break;
  //         case 2:
  //           updateKeys("Right Click");
  //           break;
  //         default:
  //           updateKeys("Mouse Button " + event.button);
  //           break;
  //       }
  //     } catch (error) {
  //       alert(error);
  //     }
  //   }, this),
  // );

  // this.captureWindow.addEventListener(
  //   "mouseup",
  //   bind(function () {
  //     this.isMouseDown = false;
  //   }, this),
  // );

  // slider value can be changed with mouse wheel
  // so we use this to capture the mouse wheel event
  // this.captureWindow.gr.onChanging = bind(function () {
  //   try {
  //     if (!this.isMouseDown) {
  //       var sl = this.captureWindow.gr;

  //       if (sl.value > 0) {
  //         updateKeys("Scroll DOWN");
  //       } else if (sl.value < 0) {
  //         updateKeys("Scroll UP");
  //       }

  //       sl.value = 0;
  //     }
  //   } catch (error) {
  //     alert(error);
  //   }
  // }, this);

  // this.captureWindow.onClose = bind(function () {
  //   try {
  //     this.captureWindow.close();
  //     this.infoWindow.close();
  //   } catch (error) {
  //     alert(error);
  //   }
  // }, this);

  this.element.onClose = function () {
    $.global.__zoom_key_bind_pass_fn__ = undefined;

    if ($.global.__zoom_plugin_cmd_ids__) {
      try {
        app.executeCommand(
          $.global.__zoom_plugin_cmd_ids__.stopKeyCaptureCmdId,
        );
      } catch (error) {
        alert("Error at line " + error.line + ":\n" + error.message);
      }
    }
  };

  this.element.show();
  // this.captureWindow.show();
}

export default KeyCapture;
