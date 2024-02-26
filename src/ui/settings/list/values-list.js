import create from "../../../../extern/object-create";
import { ZOOM_LIST_VALUES } from "../../../constants";
import List from "./list";

function ValuesList(parentEl) {
  List.call(this, parentEl);

  var valuesColumn = this.addColumn("Preset Values");

  // var listBox = parentEl.add(
  //   "ListBox { \
  //     alignment: ['fill', 'fill'], \
  //     maximumSize: [9999, 140], \
  //   }",
  // );

  for (var i = 0; i < ZOOM_LIST_VALUES.length; i++) {
    valuesColumn.addRow("StaticText { text: '" + ZOOM_LIST_VALUES[i] + "' }");
    // listBox.add("item", ZOOM_LIST_VALUES[i]);
  }

  this.setMaxSize([9999, 140]);
  var scrollBarUpdated = this.updateScrollBar();

  if (scrollBarUpdated) {
    this.element.window.layout.layout(true);
  }
}

ValuesList.prototype = create(List.prototype);

export default ValuesList;
