import create from "../../../../extern/object-create";
import { ZOOM_LIST_VALUES } from "../../../constants";
import FloatEditText from "../../float-edit-text";
import List from "./list";
import ValuesRow from "./values-row";

function ValuesList(parentEl) {
  List.call(this, parentEl);

  this.RowClass = ValuesRow;

  // var listBox = parentEl.add(
  //   "ListBox { \
  //     alignment: ['fill', 'fill'], \
  //     maximumSize: [9999, 140], \
  //   }",
  // );

  // for (var i = 0; i < ZOOM_LIST_VALUES.length; i++) {
  //   this.addRow(ZOOM_LIST_VALUES[i]);
    // listBox.add("item", ZOOM_LIST_VALUES[i]);
  // }

  this.contents = ZOOM_LIST_VALUES.slice();
  this.build();
  this.setMaxSize([9999, 145]);
  this.setMinSize([0, 145]);
}

ValuesList.prototype = create(List.prototype);

export default ValuesList;
