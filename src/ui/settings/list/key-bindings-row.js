import create from "../../../../extern/object-create";
import KeyCombination from "../key-bindings/key-combination";
import KeyBindingsColumnNamesRow from "./key-bindings-column-names-row";

function KeyBindingsRow(parentEl) {
  KeyBindingsColumnNamesRow.call(this, parentEl);

  this.filled = false;
}

KeyBindingsRow.prototype = create(KeyBindingsColumnNamesRow.prototype);
KeyBindingsRow.ACTION_NAMES = ["[+] Add", "[-] Subtract", "[=] Set To"];

KeyBindingsRow.prototype.fillHandler = function (value) {
  if (value !== undefined) {
    this.clmnCheck = this.add("Checkbox { value: " + value.enabled + " }");
    this.clmnCheck.alignment = this.columnAlignments[0];
    this.clmnCheck.margins = this.columnMargins[0];
    this.clmnCheck.element.maximumSize = [9999, 15];

    // this.clmnKeys = this.add(function (columnGr) {
    //   var keyCombination = new KeyCombination(columnGr, []);
    //   keyCombination.updateKeysWithCodes(value.keyCodes);
    //   return keyCombination;
    // });
    this.clmnKeys = this.add("StaticText { text: 'kek' }");
    this.clmnKeys.alignment = this.columnAlignments[1];
    this.clmnKeys.margins = this.columnMargins[1];

    this.clmnAction = this.add("StaticText {}");
    this.clmnAction.alignment = this.columnAlignments[2];
    this.clmnAction.margins = this.columnMargins[2];
    this.clmnAction.element.text = KeyBindingsRow.ACTION_NAMES[value.action];

    this.clmnAmount = this.add("StaticText {}");
    this.clmnAmount.alignment = this.columnAlignments[3];
    this.clmnAmount.margins = this.columnMargins[3];
    this.clmnAmount.element.text = value.amount + "%";

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
