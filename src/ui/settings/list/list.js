import bind from "../../../../extern/function-bind";
import { binarySearch, positionRelativeToParent } from "../../../utils";
import indexOf from "../../../../extern/array-indexOf";
import Row from "./row";
import { AE_OS, BLUE_COLOR, OS } from "../../../constants";

function List(parentEl) {
  this.RowClass = Row;
  this.active = false;
  this.lastClickEventTime = undefined;
  this.rows = [];
  this.selectedRows = [];
  this.colorSelected = [0.27, 0.27, 0.27, 1];
  this.colorDeselected = [0, 0, 0, 0];

  // required for range selection with the Shift key
  this.lastClickedRowInd = undefined;

  // fn to call when adding a new row
  this.addRowHandler = undefined;

  this.parentGroup = parentEl.add(
    "Group { \
      orientation: 'stack', \
      alignment: ['fill', 'fill'], \
      alignChildren: 'fill', \
      grBorder: Group {}, \
      grElement: Group { \
        margins: 1, \
      }, \
    }",
  );

  this.element = this.parentGroup.grElement.add(
    "Panel { \
      margins: 0, \
      spacing: 0, \
      alignment: ['fill', 'fill'], \
      orientation: 'row', \
      grBorder: Group { \
        alignment: ['left', 'top'], \
        minimumSize: [1, 1], \
      }, \
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

  this.parentGroup.grBorder.visible = this.active;
  this.parentGroup.grBorder.onDraw = function () {
    var r = 3; // round corner radius
    var d = 2 * r; // round corner diameter
    var g = this.graphics;
    var b = g.newBrush(g.BrushType.SOLID_COLOR, BLUE_COLOR);
    var s = this.size;
    var drawCircle = function (left, top) {
      g.ellipsePath(left, top, d, d);
      g.fillPath(b);
    };

    drawCircle(0, 0);
    drawCircle(s[0] - d, 0);
    drawCircle(s[0] - d, s[1] - d);
    drawCircle(0, s[1] - d);

    g.newPath();
    g.moveTo(r, 0);
    g.lineTo(s[0] - r, 0);
    g.lineTo(s[0], r);
    g.lineTo(s[0], s[1] - r);
    g.lineTo(s[0] - r, s[1]);
    g.lineTo(r, s[1]);
    g.lineTo(0, s[1] - r);
    g.lineTo(0, r);

    g.fillPath(b);
  };

  /** pass click events to our custom handler */
  this.element.grList.addEventListener(
    "mousedown",
    bind(function (event) {
      this.onClick(event);

      this.lastClickEventTime = event.timeStamp.getTime();
      this.activate();
    }, this),
    true,
  );

  /** TODO breaks sometimes when deleting with shift after prev deletion */
  /** TODO active status isn't reset when switching tabs */
  this.element.window.addEventListener(
    "mousedown",
    bind(function (event) {
      if (event.timeStamp.getTime() !== this.lastClickEventTime) {
        this.deactivate();
      }
    }, this),
  );

  this.element.window.addEventListener(
    "keydown",
    bind(function (event) {
      if (event.keyName === "Delete" && this.active) {
        this.deleteSelectedRows();
      }
    }, this),
  );

  this.element.graphics.backgroundColor = this.element.graphics.newBrush(
    this.element.graphics.BrushType.SOLID_COLOR,
    [0.113, 0.113, 0.113, 1],
  );
}

List.prototype.activate = function () {
  if (!this.active) {
    this.active = true;
    this.parentGroup.grBorder.visible = true;
  }
};

List.prototype.deactivate = function () {
  if (this.active) {
    this.active = false;
    this.parentGroup.grBorder.visible = false;
  }
};

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

List.prototype.deleteSelectedRows = function () {
  for (var i = 0; i < this.selectedRows.length; i++) {
    this.element.grList.grRows.remove(this.rows[this.selectedRows[i]].element);
    this.rows.splice(this.selectedRows[i], 1);
  }

  this.selectedRows.length = 0;
  this.element.grList.grRows.layout.layout(true);
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

  if (rowIndUnderCursor >= 0 && rowIndUnderCursor < this.rows.length) {
    return rowIndUnderCursor;
  }
};

List.prototype.onClick = function (event) {
  var cursorPos = this.getCursorPosFromEvent(event);
  var rowIndUnderCursor = this.getRowIndexUnderCursor(cursorPos);

  if (rowIndUnderCursor !== undefined) {
    var ctrlKey =
      (AE_OS === OS.WIN && event.ctrlKey) ||
      (AE_OS === OS.MAC && event.metaKey);

    var selectRange = undefined;
    if (event.shiftKey) {
      selectRange = {
        start: this.lastClickedRowInd,
        end: rowIndUnderCursor,
      };
    } else {
      this.lastClickedRowInd = rowIndUnderCursor;
    }

    if (!ctrlKey) {
      this.deselectAllRows();
    }

    if (selectRange) {
      this.selectRowRange(selectRange);
    } else if (ctrlKey) {
      this.inverseRowSelection(rowIndUnderCursor);
    } else {
      this.selectRow(rowIndUnderCursor);
    }

    this.rows[rowIndUnderCursor].onClick(event);
  }
};

List.prototype.selectRow = function (rowIndex) {
  if (indexOf(this.selectedRows, rowIndex) === -1) {
    var row = this.rows[rowIndex];
    this.selectedRows.push(rowIndex);

    row.setBgColor(this.colorSelected);
  }
};

List.prototype.selectRowRange = function (range) {
  var iDiff = range.start < range.end ? 1 : -1;

  for (
    var i = range.start;
    iDiff > 0 ? i <= range.end : i >= range.end;
    i += iDiff
  ) {
    this.selectRow(i);
  }
};

List.prototype.deselectRow = function (rowIndex) {
  var ind = indexOf(this.selectedRows, rowIndex);
  if (ind !== -1) {
    var row = this.rows[rowIndex];
    this.selectedRows.splice(ind, 1);

    row.setBgColor(this.colorDeselected);
  }
};

List.prototype.deselectAllRows = function () {
  for (var i = 0; i < this.selectedRows.length; i++) {
    this.rows[this.selectedRows[i]].setBgColor(this.colorDeselected);
  }

  this.selectedRows.length = 0;
};

List.prototype.inverseRowSelection = function (rowIndex) {
  if (indexOf(this.selectedRows, rowIndex) === -1) {
    this.selectRow(rowIndex);
  } else {
    this.deselectRow(rowIndex);
  }
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
