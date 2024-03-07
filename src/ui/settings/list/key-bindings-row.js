import create from "../../../../extern/object-create";
import KeyCombination from "../key-bindings/key-combination";
import Row from "./row";

function KeyBindingsRow(parentEl) {
  Row.call(this, parentEl);

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
