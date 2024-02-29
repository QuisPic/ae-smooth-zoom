import bind from "../../../../extern/function-bind";
import create from "../../../../extern/object-create";
import { strToNumStr } from "../../../utils";
import FloatEditText from "../../float-edit-text";
import Row from "./row";

function ValuesRow(parentEl, value) {
  Row.call(this, parentEl);
  this.fillHandler(value);
}

ValuesRow.prototype = create(Row.prototype);

ValuesRow.prototype.fillHandler = function (value) {
  if (value !== undefined) {
    this.add("StaticText { text: '" + value + "%' }");
  }
};

ValuesRow.prototype.editHandler = function () {
  var valueEl = this.columns[0].element;
  var value = strToNumStr(valueEl.text);

  var floatText = new FloatEditText(this.element, value ? value : "");

  floatText.setSize(this.element.size);
  floatText.setLocation([0, 0]);
  floatText.setOnChangeFn(
    bind(function (text) {
      var inputValue = strToNumStr(text);

      if (inputValue) {
        // remove floatText to free up space for new text element
        floatText.removeSelf();

        this.edit(inputValue);
      }
    }, this),
  );
};

ValuesRow.prototype.onDoubleClickHandler = function () {
  this.editHandler();
};

export default ValuesRow;
