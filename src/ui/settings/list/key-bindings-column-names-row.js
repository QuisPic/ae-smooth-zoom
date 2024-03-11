import create from "../../../../extern/object-create";
import Row from "./row";
import KeyBindingsRow from "./key-bindings-row";

function KeyBindingsColumnNamesRow(parentEl) {
  KeyBindingsRow.call(this, parentEl);
  this.names = ["Enable", "Key Combination", "Action", "Amount"];
  this.element.margins = [0, 0, 0, 1];
  this.columnMargins = [
    [5, 0, 5, 0],
    [5, 0, 5, 0],
    [5, 0, 5, 0],
    [5, 0, 5, 0],
  ];
  this.setBgColor([0.113, 0.113, 0.113, 1]);
}

KeyBindingsColumnNamesRow.prototype = create(Row.prototype);

KeyBindingsColumnNamesRow.prototype.fillHandler = function () {
  for (var i = 0; i < this.names.length; i++) {
    var col = this.add("StaticText { text: '" + this.names[i] + "' }");

    if (this.columnMargins[i]) {
      col.margins = this.columnMargins[i];
    }

    if (this.columnAlignments[i]) {
      col.alignment = this.columnAlignments[i];
    }
  }

  this.setColumnsBgColor([0.149, 0.149, 0.149, 1]);
};

export default KeyBindingsColumnNamesRow;
