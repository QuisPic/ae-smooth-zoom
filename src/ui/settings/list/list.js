import bind from "../../../../extern/function-bind";
import { binarySearch, positionRelativeToParent } from "../../../utils";
import indexOf from "../../../../extern/array-indexOf";
import Row from "./row";

function List(parentEl) {
  this.RowClass = Row;
  this.rows = [];
  this.selectedRows = [];
  this.colorSelected = [0.27, 0.27, 0.27, 1];

  // fn to call when adding a new row
  this.addRowHandler = undefined;

  this.element = parentEl.add(
    "Panel { \
      margins: 0, \
      spacing: 0, \
      alignment: ['fill', 'fill'], \
      orientation: 'row', \
      grList: Group { \
        orientation: 'stack', \
        alignment: ['fill', 'top'], \
        alignChildren: 'fill', \
        grRows: Group { \
          orientation: 'column', \
          alignment: ['fill', 'top'], \
          alignChildren: ['fill', 'top'], \
          spacing: 0, \
        }, \
      }, \
    }",
  );

  /** pass click events to our custom handler */
  this.element.grList.addEventListener(
    "mousedown",
    bind(function (event) {
      this.onClick(event);
      event.stopPropagation();
      event.preventDefault();
    }, this),
    true,
  );

  this.element.graphics.backgroundColor = this.element.graphics.newBrush(
    this.element.graphics.BrushType.SOLID_COLOR,
    [0.113, 0.113, 0.113, 1],
  );
}

List.prototype.setMaxSize = function (maxSize) {
  this.element.grList.maximumSize = maxSize;
  this.element.grList.size = maxSize;
};

List.prototype.addRow = function (content) {
  var row = new this.RowClass(this.element.grList.grRows);

  if (typeof row.fillHandler === "function") {
    row.fillHandler(content);
  }

  this.rows.push(row);
  return row;
};

List.prototype.getCursorPosFromEvent = function (event) {
  var result = positionRelativeToParent(this.element, event.target, [
    event.clientX,
    event.clientY,
  ]);

  return result;
};

List.prototype.getRowIndexUnderCursor = function (cursorPos) {
  var rowIndUnderCursor = binarySearch(
    this.rows,
    bind(function (row) {
      return (
        cursorPos[1] <
        positionRelativeToParent(this.element, row.element)[1] +
          row.element.size.height
      );
    }, this),
  );

  if (rowIndUnderCursor >= 0 && rowIndUnderCursor < this.rows.length - 1) {
    return rowIndUnderCursor;
  }
};

List.prototype.onClick = function (event) {
  var cursorPos = this.getCursorPosFromEvent(event);
  var rowIndUnderCursor = this.getRowIndexUnderCursor(cursorPos);

  if (rowIndUnderCursor !== undefined) {
    if (indexOf(this.selectedRows, rowIndUnderCursor) === -1) {
      this.deselectAllRows();
      this.selectRow(rowIndUnderCursor);
    }

    this.rows[rowIndUnderCursor].onClick(event);
  }
};

List.prototype.selectRow = function (rowIndex) {
  var row = this.rows[rowIndex];
  this.selectedRows.push(rowIndex);

  row.setBgColor(this.colorSelected);
};

List.prototype.deselectAllRows = function () {
  for (var i = 0; i < this.selectedRows.length; i++) {
    this.rows[this.selectedRows[i]].setBgColor([0, 0, 0, 0]);
  }

  this.selectedRows.length = 0;
};

List.prototype.updateScrollBar = function () {
  if (!this.element.grList.grRows.size) {
    this.element.grList.layout.layout(true);
  }

  var scrollBar = this.element.scrollBar;
  var grSlider = this.element.grList.grSlider;
  var sizeDiff =
    this.element.grList.grRows.size.height - this.element.grList.size.height;

  if (sizeDiff > 0) {
    if (!scrollBar) {
      scrollBar = this.element.add(
        "Scrollbar { \
          alignment: ['right', 'fill'], \
        }",
      );

      scrollBar.maximumSize.width = 12;
      scrollBar.onChange = bind(function () {
        this.element.grList.grRows.location.y = -this.element.scrollBar.value;
      }, this);
      scrollBar.onChanging = scrollBar.onChange;

      this.element.scrollBar = scrollBar;

      if (!grSlider) {
        /** slider to scroll the list using mouse wheel */
        grSlider = this.element.grList.add(
          "Group {\
            alignment: 'top', \
            maximumSize: [1, 1], \
            slider: Slider { \
              minvalue: -1, \
              maxvalue: 1, \
            }, \
          }",
        );

        /** remove all appearance on the slider */
        grSlider.slider.onDraw = function () {};

        grSlider.slider.onChanging = function () {
          scrollBar.value += this.value * 10;
          scrollBar.notify();

          this.value = 0;
        };

        /** remove mousedown event */
        grSlider.slider.addEventListener("mousedown", function (event) {
          if (event.cancelable) {
            event.preventDefault();
          }
        });

        this.element.grList.grSlider = grSlider;

        this.element.grList.addEventListener("mousemove", function (event) {
          grSlider.location.x = event.clientX;
          grSlider.location.y = event.clientY;
        });
      }
    }

    scrollBar.minvalue = 0;
    scrollBar.maxvalue = sizeDiff;

    return true;
  } else if (scrollBar) {
    this.element.remove(scrollBar);
    this.element.scrollBar = undefined;

    if (grSlider) {
      this.element.grList.remove(grSlider);
      this.element.grList.scrollSlider = undefined;
    }

    return true;
  }

  return false;
};

export default List;
