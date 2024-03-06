import create from "../../../../extern/object-create";
import Row from "./row";

function KeyBindingsColumnNamesRow(parentEl) {
  Row.call(this, parentEl);

  this.columnMargins = [
    [10, 2, 0, 1],
    [8, 2, 0, 1],
    [5, 2, 15, 1],
    [5, 2, 20, 1],
  ];
  this.columnAlignments = [
    ["left", "fill"],
    ["fill", "fill"],
    ["right", "fill"],
    ["right", "fill"],
  ];
}

KeyBindingsColumnNamesRow.prototype = create(Row.prototype);

KeyBindingsColumnNamesRow.prototype.fillHandler = function (names) {
  for (var i = 0; i < names.length; i++) {
    var col = this.add("StaticText { text: '" + names[i] + "' }");

    if (this.columnMargins[i]) {
      col.margins = this.columnMargins[i];
    }

    if (this.columnAlignments[i]) {
      col.alignment = this.columnAlignments[i];
    }
  }
};

export default KeyBindingsColumnNamesRow;
