import JSON from "../../extern/json2";
import { DEFAULT_SETTINGS } from "../constants";
import NumberValue from "./number-value";
import TrashIcon from "./trash-icon";

function KeyBinding(parentEl, values) {
  this.element = parentEl.add(
    "Group { \
      alignment: 'fill', \
      margins: [10, 5, 10, 5], \
      chkEnable: Checkbox { \
        preferredSize: [-1, 14], \
      }, \
      gr: Group { \
        ddlistKeys: DropDownList { \
          properties: { \
            items: ['Ctrl', 'Shift', 'Alt', 'None', '-', 'Custom...'], \
          }, \
        }, \
        txtPlus: StaticText { text: '+' }, \
        ddlistMouse: DropDownList { \
          properties: { \
            items: ['Scroll UP', 'Scroll DOWN', 'Left Click', 'Right Click', 'Middle Click', 'None', '-', 'Custom...'], \
          }, \
        }, \
        txtEquals: StaticText { text: '=' }, \
        ddlistAction: DropDownList { \
          properties: { \
            items: ['Increase by', 'Decrease by'] \
          }, \
        }, \
      }, \
    }",
  );

  values = values || JSON.parse(DEFAULT_SETTINGS.keyBindings)[0];

  this.element.gr.enabled = values.enabled;

  this.element.chkEnable.value = values.enabled;
  this.element.gr.ddlistKeys.selection = values.key;
  this.element.gr.ddlistMouse.selection = values.mouse;
  this.element.gr.ddlistAction.selection = values.action;
  this.element.gr.amount = new NumberValue(
    this.element.gr,
    "%",
    values.amount,
    0,
    undefined,
    undefined,
    undefined,
    undefined,
    "How much to change zoom",
  );
  this.element.trash = new TrashIcon(this.element, true);

  this.element.chkEnable.onClick = function () {
    this.parent.gr.enabled = this.value;
    this.helpTip = this.value ? "Enabled" : "Disabled";
  };

  this.element.chkEnable.helpTip = values.enabled ? "Enabled" : "Disabled";
  this.element.trash.element.icon.helpTip = "Remove";

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

export default KeyBinding;
