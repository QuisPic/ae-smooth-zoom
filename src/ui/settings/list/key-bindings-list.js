import preferences from "../../../preferences";
import JSON from "../../../../extern/json2";
import create from "../../../../extern/object-create";
import List from "./list";
import KeyBindingsRow from "./key-bindings-row";
import KeyBindingsColumnNamesRow from "./key-bindings-column-names-row";
import windows from "../../../windows";
import KeyBindingEditWindow from "../key-binding-edit-window";

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

  this.addColumnNames();
  this.build();
  this.setMaxSize([9999, 300]);
  this.setMinSize([0, 300]);
  this.refresh();
}

KeyBindingsList.prototype = create(List.prototype);

KeyBindingsList.prototype.editHandler = function (rowInd) {
  this.editing = true;
  var row = this.rows[rowInd];
  var values = this.contents[rowInd];

  this.editWindow = new KeyBindingEditWindow(
    values,
    row,
    values ? "Edit Key Binding" : "Create Key Binding",
  );
  windows.new(this.editWindow);
};

KeyBindingsList.prototype.abortEditHandler = function () {
  this.editing = false;
  if (this.editWindow) {
    this.editWindow.element.close();
  }
};

KeyBindingsList.prototype.onChangeHandler = function () {
  preferences.save("keyBindings", JSON.stringify(this.contents));
};

export default KeyBindingsList;
