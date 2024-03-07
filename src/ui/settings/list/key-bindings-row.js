import indexOf from "../../../../extern/array-indexOf";
import create from "../../../../extern/object-create";
import { positionRelativeToParent } from "../../../utils";
import KeyCombination from "../key-bindings/key-combination";
import Row from "./row";

function KeyBindingsRow(parentEl) {
  Row.call(this, parentEl);

  this.colorSelectedDisabled = [0.2, 0.2, 0.2, 1];
  this.element.spacing = 2;
  this.columnMargins = [5, 2, 5, 2];
  this.columnAlignments = [
    ["left", "fill"],
    ["fill", "fill"],
    ["right", "fill"],
    ["right", "fill"],
  ];

  this.filled = false;
}

KeyBindingsRow.prototype = create(Row.prototype);
KeyBindingsRow.ACTION_NAMES = ["[+] Add", "[-] Subtract", "[=] Set To"];

KeyBindingsRow.prototype.fillHandler = function (values) {
  if (values !== undefined) {
    this.clmnCheck = this.add("Checkbox { alignment: ['center', 'fill'] }");
    this.clmnCheck.element.value = values.enabled;
    this.clmnCheck.alignment = this.columnAlignments[0];
    this.clmnCheck.margins = this.columnMargins;
    this.clmnCheck.element.maximumSize = [9999, 15];

    this.clmnKeys = this.add(function (columnGr) {
      var keyCombination = new KeyCombination(columnGr, []);
      keyCombination.updateKeysWithCodes(values.keyCodes);
      return keyCombination;
    });
    // this.clmnKeys = this.add("StaticText { text: 'kek' }");
    this.clmnKeys.alignment = this.columnAlignments[1];
    this.clmnKeys.margins = this.columnMargins;

    this.clmnAction = this.add("StaticText {}");
    this.clmnAction.alignment = this.columnAlignments[2];
    this.clmnAction.margins = this.columnMargins;
    this.clmnAction.element.text = KeyBindingsRow.ACTION_NAMES[values.action];

    this.clmnAmount = this.add("StaticText {}");
    this.clmnAmount.alignment = this.columnAlignments[3];
    this.clmnAmount.margins = this.columnMargins;
    this.clmnAmount.element.text = values.amount + "%";

    if (!values.enabled) {
      this.disable();
    }

    this.filled = true;
  }
};

KeyBindingsRow.prototype.editHandler = function () {
  this.editing = true;
};

// ValuesRow.prototype.abortEditHandler = function () {
//   if (this.floatText && this.floatText.onBlurFn) {
//     this.floatText.onBlurFn();
//   }
// };

KeyBindingsRow.prototype.onDoubleClickHandler = function () {
  this.editHandler();
};

KeyBindingsRow.prototype.onClickHandler = function (event) {
  // var check = this.clmnCheck.element;
  // var cursorPos = positionRelativeToParent(this.element, event.target, [
  //   event.clientX,
  //   event.clientY,
  // ]);
  // var checkPos = positionRelativeToParent(this.element, check);
  //
  // if (
  //   cursorPos[0] >= checkPos[0] &&
  //   cursorPos[0] <= checkPos[0] + check.size[0] &&
  //   cursorPos[1] >= checkPos[1] &&
  //   cursorPos[1] <= checkPos[1] + check.size[1]
  // ) {
  //   // this.clmnCheck.element.value = !this.clmnCheck.element.value;
  //   this.clmnCheck.element.notify();
  // }

  if (event.target === this.clmnCheck.element) {
    this.clmnCheck.element.notify();

    if (this.clmnCheck.element.value) {
      this.enable();
    } else {
      this.disable();
    }

    /** if this row is selected then set the right bg color */
    for (var i = 0; i < this.list.selectedRows.length; i++) {
      if (this.list.rows[this.list.selectedRows[i]] === this) {
        this.setBgColor(this.getColorSelected());
        break;
      }
    }
  }
};

KeyBindingsRow.prototype.enable = function () {
  for (var i = 1; i < this.columns.length; i++) {
    this.columns[i].enabled = true;
  }
};

KeyBindingsRow.prototype.disable = function () {
  for (var i = 1; i < this.columns.length; i++) {
    this.columns[i].enabled = false;
  }
};

KeyBindingsRow.prototype.getColorSelected = function () {
  if (this.clmnCheck.element.value) {
    return this.colorSelected;
  } else {
    return this.colorSelectedDisabled;
  }
};

export default KeyBindingsRow;
