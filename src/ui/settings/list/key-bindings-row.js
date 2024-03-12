import create from "../../../../extern/object-create";
import Row from "./row";
import KeyCombination from "../key-bindings/key-combination";
import { positionRelativeToParent } from "../../../utils";

function KeyBindingsRow(list) {
  Row.call(this, list);

  this.colorSelectedDisabled = [0.2, 0.2, 0.2, 1];
  this.element.spacing = 2;
  this.columnMargins = [
    [5, 2, 5, 2],
    [5, 2, 5, 2],
    [5, 2, 5, 2],
    [5, 2, 5, 2],
  ];
  this.columnAlignments = [
    ["left", "fill"],
    ["fill", "fill"],
    ["right", "fill"],
    ["right", "center"],
  ];

  this.filled = false;
}

KeyBindingsRow.prototype = create(Row.prototype);
KeyBindingsRow.ACTION_NAMES = ["Change:", "Set to:"];

KeyBindingsRow.prototype.alignColumns = function () {
  for (var i = 0; i < this.columns.length; i++) {
    this.columns[i].alignment = this.columnAlignments[i];
    this.columns[i].margins = this.columnMargins[i];
  }
};

KeyBindingsRow.prototype.fillHandler = function (values) {
  if (values !== undefined) {
    this.clmnCheck = this.add("Checkbox { alignment: ['center', 'fill'] }");
    this.clmnCheck.element.value = values.enabled;
    this.clmnCheck.element.maximumSize = [9999, 15];

    this.clmnKeys = this.add(function (columnGr) {
      var keyCombination = new KeyCombination(columnGr, []);
      keyCombination.updateKeysWithCodes(values.keyCodes);
      return keyCombination;
    });

    this.clmnAction = this.add("StaticText {}");
    this.clmnAction.element.text = KeyBindingsRow.ACTION_NAMES[values.action];

    this.clmnAmount = this.add("StaticText {}");
    this.clmnAmount.element.text = values.amount + "%";

    this.alignColumns();

    if (!values.enabled) {
      this.disable();
    }

    this.filled = true;
  }
};

// ValuesRow.prototype.abortEditHandler = function () {
//   if (this.floatText && this.floatText.onBlurFn) {
//     this.floatText.onBlurFn();
//   }
// };

KeyBindingsRow.prototype.onClickHandler = function (event) {
  var check = this.clmnCheck.element;
  var cursorPos = positionRelativeToParent(this.element, event.target, [
    event.clientX,
    event.clientY,
  ]);
  var checkPos = positionRelativeToParent(this.element, check);

  if (
    cursorPos[0] >= checkPos[0] &&
    cursorPos[0] <= checkPos[0] + check.size[0] &&
    cursorPos[1] >= checkPos[1] &&
    cursorPos[1] <= checkPos[1] + check.size[1]
  ) {
    // this.clmnCheck.element.value = !this.clmnCheck.element.value;
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

  // if (event.target === this.clmnCheck.element) {
  //   this.clmnCheck.element.notify();
  //
  // }
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
