import bind from "../../extern/function-bind";
import JSON from "../../extern/json2";
import { DEFAULT_SETTINGS, TABLE_SIZES } from "../constants";
import EditIcon from "./edit-icon";
import KeyCapture from "./key-capture";
import KeyCombination from "./key-combination";
import Line from "./line";
import NumberValue from "./number-value";
import TrashIcon from "./trash-icon";

function KeyBinding(parentEl, values) {
  // invisible lines here are just to add space in between elements
  // to line up them with the column names
  this.element = parentEl.add(
    "Group { \
      spacing: 5, \
      alignment: 'fill', \
      margins: [10, 5, 10, 5], \
      chkEnable: Checkbox {}, \
      grLine0: Group { alignment: 'fill', visible: false }, \
      gr: Group { \
        spacing: 5, \
        grEdit: Group {}, \
        grLine1: Group { alignment: 'fill', visible: false }, \
        grKeys: Group {}, \
        grLine2: Group { alignment: 'fill', visible: false }, \
        ddlistAction: DropDownList { \
          properties: { \
            items: ['Increase by', 'Decrease by', 'Set To'] \
          }, \
        }, \
        grLine3: Group { alignment: 'fill', visible: false }, \
        grAmount: Group {}, \
        grLine4: Group { alignment: 'fill', visible: false }, \
      }, \
    }",
  );

  var gr = this.element.gr;
  values = values || JSON.parse(DEFAULT_SETTINGS.keyBindings)[0];

  this.element.chkEnable.value = values.enabled;
  gr.enabled = values.enabled;
  gr.ddlistAction.selection = values.action;

  gr.grEdit.editIcon = new EditIcon(gr.grEdit, true);
  this.element.trash = new TrashIcon(this.element, true);

  gr.grKeys.keyCombination = new KeyCombination(
    gr.grKeys,
    ["Ctrl", "Shift", "Scroll UP"],
    TABLE_SIZES[2],
    "left",
  );

  gr.grAmount.numberValue = new NumberValue(gr.grAmount, "%", values.amount, 0);

  new Line(this.element.grLine0);
  new Line(gr.grLine1);
  new Line(gr.grLine2);
  new Line(gr.grLine3);
  new Line(gr.grLine4);

  this.element.chkEnable.preferredSize = [TABLE_SIZES[0], 14];
  gr.grEdit.preferredSize = [TABLE_SIZES[1], -1];
  gr.grEdit.minimumSize = [TABLE_SIZES[1], -1];
  gr.grKeys.preferredSize = [TABLE_SIZES[2], -1];
  gr.ddlistAction.preferredSize = [TABLE_SIZES[3], -1];
  gr.grAmount.preferredSize = [TABLE_SIZES[4], -1];
  gr.grAmount.minimumSize = [TABLE_SIZES[4], -1];
  this.element.trash.element.preferredSize = [TABLE_SIZES[5], -1];

  gr.grEdit.editIcon.element.icon.helpTip = "Edit";
  this.element.chkEnable.helpTip = values.enabled ? "Enabled" : "Disabled";
  this.element.trash.element.icon.helpTip = "Remove";

  this.element.chkEnable.onClick = function () {
    this.parent.gr.enabled = this.value;
    this.helpTip = this.value ? "Enabled" : "Disabled";
  };

  gr.grEdit.editIcon.element.addEventListener(
    "click",
    bind(function (event) {
      if (event.eventPhase === "target") {
        this.keyCaptureWindow = new KeyCapture(this);
      }
    }, this),
  );

  this.element.trash.element.addEventListener("click", function (event) {
    if (event.eventPhase === "target") {
      var ind = undefined;

      for (var i = 0; i < parentEl.children.length; i++) {
        if (parentEl.children[i] === this.parent) {
          ind = i;
          break;
        }
      }

      if (ind !== undefined) {
        // remove the line
        parentEl.remove(ind + 1);

        parentEl.remove(ind);

        parentEl.window.layout.layout(true);
      } else {
        throw "Key binding not found.";
      }
    }
  });
}

KeyBinding.prototype.updateKeys = function (keysArr) {
  this.element.gr.grKeys.keyCombination.updateKeys(keysArr);
};

export default KeyBinding;
