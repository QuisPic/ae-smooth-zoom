import preferences from "../../../preferences";
import JSON from "../../../../extern/json2";
import create from "../../../../extern/object-create";
import List from "./list";
import KeyBindingsRow from "./key-bindings-row";
import KeyBindingsColumnNamesRow from "./key-bindings-column-names-row";

function KeyBindingsList(parentEl) {
  List.call(this, parentEl);

  this.RowClass = KeyBindingsRow;
  this.ColumnNamesClass = KeyBindingsColumnNamesRow;

  var listValues =
    typeof preferences.keyBindings === "string"
      ? JSON.parse(preferences.keyBindings)
      : preferences.keyBindings;

  if (listValues) {
    this.contents = listValues;
  }

  // this.addColumnNames(["Enable", "Key Combination", "Action", "Amount"]);
  this.build();
  this.setMaxSize([9999, 200]);
  this.setMinSize([0, 200]);
  this.refresh();
}

KeyBindingsList.prototype = create(List.prototype);

KeyBindingsList.prototype.onChangeHandler = function () {
  preferences.save("keyBindings", JSON.stringify(this.contents));
};

export default KeyBindingsList;
