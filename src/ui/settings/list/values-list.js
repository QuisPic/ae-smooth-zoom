import preferences from "../../../preferences";
import JSON from "../../../../extern/json2";
import create from "../../../../extern/object-create";
import List from "./list";
import ValuesRow from "./values-row";

function ValuesList(parentEl) {
  List.call(this, parentEl);

  this.RowClass = ValuesRow;

  var listValues =
    typeof preferences.presetValues === "string"
      ? JSON.parse(preferences.presetValues)
      : preferences.presetValues;

  if (listValues) {
    this.contents = listValues;
  }

  this.build();
  this.setMaxSize([9999, 145]);
  this.setMinSize([0, 145]);
}

ValuesList.prototype = create(List.prototype);

ValuesList.prototype.onChangeHandler = function () {
  preferences.save("presetValues", JSON.stringify(this.contents));
};

export default ValuesList;
