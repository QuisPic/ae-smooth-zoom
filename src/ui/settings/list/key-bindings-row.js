import bind from "../../../../extern/function-bind";
import create from "../../../../extern/object-create";
import KeyCombination from "../key-bindings/key-combination";
import Row from "./row";

function KeyBindingsRow(parentEl) {
  Row.call(this, parentEl);
  this.filled = false;
}

KeyBindingsRow.prototype = create(Row.prototype);
KeyBindingsRow.ACTION_NAMES = ["Add", "Subtract", "Set To"];

KeyBindingsRow.prototype.fillHandler = function (value) {
  if (value !== undefined) {
    this.clmnCheck = this.add("Checkbox { value: " + value.enabled + " }");

    this.clmnKeys = this.add(function (columnGr) {
      var keyCombination = new KeyCombination(columnGr, []);
      keyCombination.updateKeysWithCodes(value.keyCodes);
      return keyCombination;
    });

    this.clmnAction = this.add(
      "StaticText { text: '" +
        KeyBindingsRow.ACTION_NAMES[value.action] +
        "' }",
    );

    this.clmnAmount = this.add("StaticText { text: '" + value.amount + "%' }");

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

export default KeyBindingsRow;
