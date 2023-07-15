import KeyCombination from "./key-combination";
import bind from "../../extern/function-bind";
import { indexOf, getPrimaryScreen, getPressedKeys } from "../utils";

function KeyCapture(keyBinding) {
  this.keyBinding = keyBinding;

  this.infoWindow = new Window(
    "palette { \
      alignChildren: ['center','center'], \
      properties: { \
        borderless: true, \
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
        txt1: StaticText { \
          text: 'Press Enter to accept. Esc to cancel.', \
        }, \
      }, \
    }",
  );

  this.captureWindow = new Window(
    "palette { \
      margins: 0, \
      alignChildren: ['fill','fill'], \
      orientation: 'stack', \
      opacity: 0.01, \
      properties: { \
        borderless: true, \
      }, \
      gr: Slider { minvalue: -100 }, \
    }",
  );

  var primaryScreen = getPrimaryScreen();
  var gr = this.infoWindow.gr;

  this.captureWindow.preferredSize = [
    primaryScreen.right,
    primaryScreen.bottom,
  ];

  // remove all drawing for the slider
  this.captureWindow.gr.onDraw = function () {};

  var g = this.infoWindow.graphics;
  var b = g.newBrush(g.BrushType.SOLID_COLOR, [0.05, 0.05, 0.05, 1]);
  this.infoWindow.graphics.backgroundColor = b;

  // place temp key to calculate the size for the group
  this.keyCombination = new KeyCombination(gr.pnlCapture, ["A"], "center");
  gr.layout.layout(true);
  gr.pnlCapture.minimumSize = gr.pnlCapture.size;
  // remove the temp key
  this.keyCombination.updateKeys([]);

  this.pressedKeys = [];
  this.combinationEnded = false;
  this.isMouseDown = false;

  var updateKeys = bind(function (keyName) {
    if (this.combinationEnded) {
      this.pressedKeys = [];
      this.combinationEnded = false;
    }

    if (indexOf(this.pressedKeys, keyName) === -1) {
      this.pressedKeys = getPressedKeys(keyName);
      this.keyCombination.updateKeys(this.pressedKeys);
      this.infoWindow.layout.layout(true);
    }
  }, this);

  this.captureWindow.addEventListener(
    "keydown",
    bind(function (event) {
      try {
        if (event.keyName === "Enter") {
          this.keyBinding.updateKeys(this.pressedKeys);
          this.captureWindow.close();
        } else if (event.keyName === "Escape") {
          this.captureWindow.close();
        } else {
          updateKeys(event.keyName);
        }
      } catch (error) {
        alert(error);
      }
    }, this),
  );

  this.captureWindow.addEventListener(
    "keyup",
    bind(function () {
      try {
        var pressedKeys = getPressedKeys();

        if (pressedKeys.length === 0) {
          this.combinationEnded = true;
        }
      } catch (error) {
        alert(error);
      }
    }, this),
  );

  this.captureWindow.addEventListener(
    "mousedown",
    bind(function (event) {
      try {
        event.preventDefault();
        this.isMouseDown = true;

        switch (event.button) {
          case 0:
            updateKeys("Left Click");
            break;
          case 1:
            updateKeys("Middle Click");
            break;
          case 2:
            updateKeys("Right Click");
            break;
          default:
            updateKeys("Mouse Button " + event.button);
            break;
        }
      } catch (error) {
        alert(error);
      }
    }, this),
  );

  this.captureWindow.addEventListener(
    "mouseup",
    bind(function () {
      this.isMouseDown = false;
    }, this),
  );

  // slider value can be changed with mouse wheel
  // so we use this to capture the mouse wheel event
  this.captureWindow.gr.onChanging = bind(function () {
    try {
      if (!this.isMouseDown) {
        var sl = this.captureWindow.gr;

        if (sl.value > 0) {
          updateKeys("Scroll DOWN");
        } else if (sl.value < 0) {
          updateKeys("Scroll UP");
        }

        sl.value = 0;
      }
    } catch (error) {
      alert(error);
    }
  }, this);

  this.captureWindow.onDeactivate = bind(function () {
    try {
      this.captureWindow.close();
      this.infoWindow.close();
    } catch (error) {
      alert(error);
    }
  }, this);

  this.infoWindow.show();
  this.captureWindow.show();
}

export default KeyCapture;
