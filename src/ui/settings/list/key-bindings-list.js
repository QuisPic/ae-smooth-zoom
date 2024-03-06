import preferences from "../../../preferences";
import JSON from "../../../../extern/json2";
import create from "../../../../extern/object-create";
import List from "./list";
import KeyBindingsRow from "./key-bindings-row";

function KeyBindingsList(parentEl) {
  List.call(this, parentEl);

  this.RowClass = KeyBindingsRow;

  var listValues =
    typeof preferences.keyBindings === "string"
      ? JSON.parse(preferences.keyBindings)
      : preferences.keyBindings;

  if (listValues) {
    this.contents = listValues;
  }

  this.build();
  this.setMaxSize([9999, 145]);
  this.setMinSize([0, 145]);
}

KeyBindingsList.prototype = create(List.prototype);

KeyBindingsList.prototype.onChangeHandler = function () {
  preferences.save("keyBindings", JSON.stringify(this.contents));
};

export default KeyBindingsList;
