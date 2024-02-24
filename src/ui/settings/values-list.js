import { ZOOM_LIST_VALUES } from "../../constants";

function ValuesList(parentEl) {
  this.element = parentEl.add(
    "Panel { \
      text: 'Preset Values', \
      maximumSize: [9999, 150], \
      listValues: ListBox { \
        alignment: ['fill', 'fill'], \
      }, \
    }",
  );

  for (var i = 0; i < ZOOM_LIST_VALUES.length; i++) {
    this.element.listValues.add("item", ZOOM_LIST_VALUES[i]);
  }
}

export default ValuesList;
