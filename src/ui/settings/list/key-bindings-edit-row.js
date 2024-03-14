import bind from "../../../../extern/function-bind";
import create from "../../../../extern/object-create";
import {
  BLUE_COLOR,
  EVENT_KEY_PRESSED,
  EVENT_MOUSE_PRESSED,
  VC_ENTER,
  VC_ESCAPE,
  VC_EX_ENTER,
} from "../../../constants";
import { drawRoundRect } from "../../../utils";
import zoomPlugin from "../../../zoomPlugin";
import NumberValue from "../../number-value";
import KeyCombination from "../key-bindings/key-combination";
import KeyBindingsRow from "./key-bindings-row";

function KeyBindingsEditRow(list) {
  KeyBindingsRow.call(this, list);

  this.isMouseOverSaveBtn = false;
  this.isKeyCapturing = false;
  this.columnMargins = [
    [5, 2, 5, 2],
    [0, 0, 0, 0],
    [5, 2, 5, 2],
    [5, 2, 5, 2],
  ];
}

KeyBindingsEditRow.prototype = create(KeyBindingsRow.prototype);

KeyBindingsEditRow.prototype.getValues = function () {
  return {
    enabled: this.clmnCheck.element.value,
    keyCodes: this.keyCodes,
    action: this.clmnAction.element.selection.index,
    amount: this.clmnAmount.element.getValue(),
  };
};

KeyBindingsEditRow.prototype.fillHandler = function (values) {
  values = values || {
    enabled: true,
    keyCodes: undefined,
    action: 0,
    amount: 1,
  };

  this.keyCodes = values.keyCodes;

  this.clmnCheck = this.add("Checkbox { alignment: ['center', 'fill'] }");
  this.clmnCheck.element.value = values.enabled;
  this.clmnCheck.element.maximumSize = [9999, 15];

  this.clmnKeys = this.add(
    bind(function (columnGr) {
      var grKeys = columnGr.add(
        "Group { \
          orientation: 'stack', \
          alignChildren: 'fill', \
          grStroke: Custom { \
            visible: false, \
          }, \
        }",
      );

      this.keyCombination = new KeyCombination(grKeys, []);

      if (values.keyCodes) {
        this.keyCombination.updateKeysWithCodes(values.keyCodes);
      }

      this.keyCombination.element.margins = [5, 2, 5, 2];
      this.keyCombination.element.graphics.backgroundColor =
        grKeys.graphics.newBrush(
          grKeys.graphics.BrushType.SOLID_COLOR,
          [0, 0, 0, 0],
        );

      grKeys.addEventListener("mousemove", function (event) {
        if (event.eventPhase === "target") {
          this.grStroke.visible = true;
        }
      });
      grKeys.addEventListener(
        "mouseout",
        bind(function (event) {
          if (!this.isKeyCapturing && event.eventPhase === "target") {
            this.clmnKeys.element.grStroke.visible = false;
          }
        }, this),
      );

      grKeys.grStroke.onDraw = bind(function () {
        var penColor = this.isKeyCapturing ? BLUE_COLOR : [0.3, 0.3, 0.3, 1];

        var brushColor = this.isKeyCapturing
          ? [0, 0, 0, 1]
          : [0.16, 0.16, 0.16, 1];

        var grStroke = this.clmnKeys.element.grStroke;
        var g = grStroke.graphics;
        var p = g.newPen(g.PenType.SOLID_COLOR, penColor, 2);
        var b = g.newBrush(g.BrushType.SOLID_COLOR, brushColor);

        drawRoundRect(0, g, b, p, grStroke.size);
      }, this);

      grKeys.btn = grKeys.add("Button { helpTip: 'Click to change' }");
      grKeys.btn.onDraw = function () {};
      grKeys.btn.addEventListener(
        "mousedown",
        bind(function () {
          this.startKeyCapture();
        }, this),
      );

      /** Put a link to this object in global scope so we can access it from the plug-in */
      $.global.__zoom_key_capture_object__ = this;

      return grKeys;
    }, this),
  );

  this.clmnAction = this.add(
    "DropDownList { \
      properties: { \
        items: ['Change:', 'Set to:'] \
      }, \
    }",
  );
  this.clmnAction.element.selection = values.action;
  this.clmnAction.element.onChange = bind(function () {
    if (this.clmnAction.element.selection.index === 0) {
      this.clmnAmount.element.minValue = undefined;
    } else if (this.clmnAction.element.selection.index === 1) {
      this.clmnAmount.element.minValue = 0;

      if (this.clmnAmount.element.getValue() < 0) {
        this.clmnAmount.element.setValue(0);
      }
    }
  }, this);

  this.clmnAmount = this.add(function (columnGr) {
    return new NumberValue(
      columnGr,
      "%",
      values.amount,
      values.action === 1 ? 0 : undefined,
    );
  });

  this.alignColumns();
};

KeyBindingsEditRow.prototype.startKeyCapture = function () {
  if (zoomPlugin.isAvailable()) {
    this.isKeyCapturing = true;
    this.clmnKeys.element.btn.active = false;
    this.clmnKeys.element.btn.visible = false;
    this.clmnKeys.element.grStroke.visible = true;
    this.clmnKeys.element.grStroke.notify("onDraw");

    /** disable all other columns */
    for (var i = 0; i < this.columns.length; i++) {
      if (this.columns[i] === this.clmnKeys) {
        continue;
      }

      this.columns[i].enabled = false;
    }

    this.keyCombination.updateKeys([]);
    this.list.editWindow.addCaptureInfo();

    try {
      zoomPlugin.startKeyCapture();
    } catch (error) {
      alert("Error at line " + $.line + ":\n" + error.message);
    }
  }
};

KeyBindingsEditRow.prototype.endKeyCapture = function () {
  this.list.editWindow.deleteCaptureInfo();
  this.isKeyCapturing = false;
  this.clmnKeys.element.grStroke.notify("onDraw");
  this.clmnKeys.element.grStroke.visible = false;
  this.clmnKeys.element.btn.visible = true;

  /** enable all columns */
  for (var i = 0; i < this.columns.length; i++) {
    this.columns[i].enabled = true;
  }

  if (zoomPlugin.isAvailable()) {
    try {
      zoomPlugin.endKeyCapture();
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
KeyBindingsEditRow.prototype.passFn = function (type, mask, keycode) {
  if (
    type === EVENT_KEY_PRESSED &&
    (keycode === VC_ENTER || keycode === VC_EX_ENTER)
  ) {
    if (this.keyCombination.keyNames.length > 0) {
      this.keyCodes = this.keyCombination.keyCodes;
      this.endKeyCapture();
    } else if (this.keyCodes) {
      this.keyCombination.updateKeysWithCodes(this.keyCodes);
      this.endKeyCapture();
    } else {
      this.element.window.close();
    }
  } else if (type === EVENT_KEY_PRESSED && keycode === VC_ESCAPE) {
    if (!this.keyCodes) {
      this.element.window.close();
    } else {
      this.keyCombination.updateKeysWithCodes(this.keyCodes);
      this.endKeyCapture();
    }
  } else if (!(type === EVENT_MOUSE_PRESSED && this.isMouseOverSaveBtn)) {
    this.keyCombination.updateKeysWithCodes({
      type: type,
      mask: mask,
      keycode: keycode,
    });

    this.element.layout.layout(true);
  }
};

export default KeyBindingsEditRow;
