import create from "../../../../extern/object-create";
import { ZOOM_LIST_VALUES } from "../../../constants";
import FloatEditText from "../../float-edit-text";
import List from "./list";
import ValuesRow from "./values-row";

function ValuesList(parentEl) {
  List.call(this, parentEl);

  this.RowClass = ValuesRow;

  // var valuesColumn = this.addColumn("Preset Values");

  // var listBox = parentEl.add(
  //   "ListBox { \
  //     alignment: ['fill', 'fill'], \
  //     maximumSize: [9999, 140], \
  //   }",
  // );

  for (var i = 0; i < ZOOM_LIST_VALUES.length; i++) {
    this.addRow(ZOOM_LIST_VALUES[i]);
    // row.setOnDoubleClickHandler(editRowValue);
    // listBox.add("item", ZOOM_LIST_VALUES[i]);
  }

  // var lastRow = this.addRow();
  // lastRow.add(
  //   "DropDownList { \
  //     properties: { \
  //       items: ['one', 'two', 'three'], \
  //     }, \
  //   }",
  // );

  this.setMaxSize([9999, 140]);
  var scrollBarUpdated = this.updateScrollBar();

  if (scrollBarUpdated) {
    this.element.window.layout.layout(true);
  }
}

ValuesList.prototype = create(List.prototype);

export default ValuesList;
