import bind from "../../../../extern/function-bind";
import create from "../../../../extern/object-create";
import { strToNumStr } from "../../../utils";
import FloatEditText from "../../float-edit-text";
import Row from "./row";

function ValuesRow(parentEl) {
  Row.call(this, parentEl);
  this.filled = false;
}

ValuesRow.prototype = create(Row.prototype);

ValuesRow.prototype.fillHandler = function (value) {
  if (value !== undefined) {
    this.add("StaticText { text: '" + value + "%' }");
    this.filled = true;
  } else {
    if (!this.element.parent.size) {
      this.element.window.layout.layout(true);
    }

    if (this.element.parent.size) {
      var strSize = this.element.graphics.measureString("1");

      this.setMinSize([
        this.element.parent.size[0],
        strSize[1] + this.columnMargins[1] + this.columnMargins[3],
      ]);
    }
  }
};

ValuesRow.prototype.editHandler = function (list) {
  this.editing = true;

  var valueEl = this.columns.length > 0 ? this.columns[0].element : undefined;
  var value = valueEl ? strToNumStr(valueEl.text) : "";

  this.floatText = new FloatEditText(this.element);

  this.floatText.setSize(this.element.size);
  this.floatText.setLocation([0, 0]);

  if (value) {
    this.floatText.setValue(value);
  }

  this.floatText.setOnBlurFn(
    bind(function () {
      if (!this.filled && list) {
        list.deleteRow(this);
      }

      this.floatText.removeSelf();
      this.editing = false;
    }, this),
  );

  this.floatText.setOnChangeFn(
    bind(function (text) {
      var inputValue = strToNumStr(text);

      if (inputValue) {
        // remove floatText to free up space for new text element
        this.floatText.removeSelf();

        this.edit(inputValue);
      }
    }, this),
  );
};

ValuesRow.prototype.abortEditHandler = function () {
  if (this.floatText && this.floatText.onBlurFn) {
    this.floatText.onBlurFn();
  }
};

ValuesRow.prototype.onDoubleClickHandler = function () {
  this.editHandler();
};

export default ValuesRow;
