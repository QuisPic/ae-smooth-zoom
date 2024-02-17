import bind from "../../../../extern/function-bind";
import { TABLE_SIZES } from "../../../constants";
import EditIcon from "./edit-icon";
import KeyCombination from "./key-combination";
import Line from "../../line";
import NumberValue from "../../number-value";
import TrashIcon from "./trash-icon";
import windows from "../../../windows";

function KeyBinding(parentEl, values, kbWindow) {
  this.kbWindow = kbWindow;

  /**
   * invisible lines here are just to add space in between elements
   * to line up them with the column names
   */
  this.element = parentEl.add(
    "Group { \
      spacing: 5, \
      alignment: ['fill', 'center'], \
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
            items: ['(+) Add', '(-) Subtract', '(=) Set To'] \
          }, \
        }, \
        grLine3: Group { alignment: 'fill', visible: false }, \
        grAmount: Group {}, \
        grLine4: Group { alignment: 'fill', visible: false }, \
      }, \
    }",
  );

  var gr = this.element.gr;

  this.element.chkEnable.value = values.enabled;
  gr.enabled = values.enabled;
  gr.ddlistAction.selection = values.action;

  gr.grEdit.editIcon = new EditIcon(
    gr.grEdit,
    true,
    values.enabled,
    bind(function (event) {
      if (event.eventPhase === "target") {
        windows.newKeyCaptureWindow(
          bind(function (keyNames, keyCodes) {
            var targetKeyCombination = this.element.gr.grKeys.keyCombination;

            targetKeyCombination.updateKeys(keyNames);
            targetKeyCombination.keyCodes = keyCodes;
          }, this),
        );
      }
    }, this),
  );

  this.element.trash = new TrashIcon(
    this.element,
    true,
    bind(function (event) {
      if (event.eventPhase === "target") {
        this.kbWindow.removeKeyBinding(this);
      }
    }, this),
  );

  gr.grKeys.keyCombination = new KeyCombination(
    gr.grKeys,
    [],
    TABLE_SIZES[2],
    "left",
  );
  gr.grKeys.keyCombination.updateKeysWithCodes(values.keyCodes);

  gr.grAmount.numberValue = new NumberValue(gr.grAmount, "%", values.amount, 0);

  new Line(this.element.grLine0);
  new Line(gr.grLine1);
  new Line(gr.grLine2);
  new Line(gr.grLine3);
  new Line(gr.grLine4);

  this.element.chkEnable.preferredSize = [TABLE_SIZES[0], 14];
  this.element.chkEnable.maximumSize = [TABLE_SIZES[0], 14];
  gr.grEdit.preferredSize = [TABLE_SIZES[1], -1];
  gr.grEdit.minimumSize = [TABLE_SIZES[1], 0];
  gr.grKeys.preferredSize = [TABLE_SIZES[2], -1];
  gr.ddlistAction.preferredSize = [TABLE_SIZES[3], -1];
  gr.ddlistAction.minimumSize = [TABLE_SIZES[3], -1];
  gr.grAmount.preferredSize = [TABLE_SIZES[4], -1];
  gr.grAmount.minimumSize = [TABLE_SIZES[4], 0];
  this.element.trash.element.preferredSize = [TABLE_SIZES[5], -1];

  gr.grEdit.editIcon.element.icon.helpTip = "Edit";
  this.element.chkEnable.helpTip = values.enabled ? "Enabled" : "Disabled";
  this.element.trash.element.icon.helpTip = "Remove";

  this.element.chkEnable.onClick = bind(function () {
    this.onOff(this.element.chkEnable.value);
    this.kbWindow.element.pnlKeyBindings.grColumnNames.columnNames.syncCheck();
  }, this);
}

KeyBinding.prototype.onOff = function (val) {
  var gr = this.element.gr;

  gr.grEdit.editIcon.element.icon.enabled = val;
  gr.enabled = val;

  this.element.chkEnable.value = val;
  this.element.chkEnable.helpTip = val ? "Enabled" : "Disabled";
};

KeyBinding.prototype.updateKeys = function (keyNames) {
  this.element.gr.grKeys.keyCombination.updateKeys(keyNames);
};

export default KeyBinding;
