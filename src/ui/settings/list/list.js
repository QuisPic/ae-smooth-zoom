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
  this.colorDeselected = [0.113, 0.113, 0.113, 1];

  // required for range selection with the Shift key
  this.lastClickedRowInd = undefined;

  // fn to call when adding a new row
  this.addRowHandler = undefined;

  this.parentGroup = parentEl.add(
    "Group { \
      orientation: 'row', \
      alignment: ['fill', 'fill'], \
      alignChildren: ['fill', 'top'], \
      gr: Group { \
        orientation: 'stack', \
        alignment: ['fill', 'fill'], \
        alignChildren: 'fill', \
        grBorder: Group {}, \
        grElement: Group { \
          margins: 1, \
        }, \
      }, \
      grButtons: Group { \
        alignment: ['right', 'top'], \
        orientation: 'column', \
        btnNew: IconButton { title: 'New', preferredSize: [90, 22] }, \
        btnEdit: IconButton { title: 'Edit', preferredSize: [90, 22] }, \
        btnDelete: IconButton { title: 'Delete', preferredSize: [90, 22] }, \
      }, \
    }",
  );

  this.element = this.parentGroup.gr.grElement.add(
    "Panel { \
      margins: 0, \
      spacing: 0, \
      alignment: ['fill', 'fill'], \
      orientation: 'row', \
      grList: Group { \
        orientation: 'stack', \
        alignment: ['fill', 'fill'], \
        alignChildren: 'fill', \
        grRows: Group { \
          orientation: 'column', \
          alignment: ['fill', 'top'], \
          alignChildren: ['fill', 'top'], \
          spacing: 1, \
        }, \
      }, \
    }",
  );

  this.setButtonsPosition(List.BUTTONS_POSITION.RIGHT);

  this.parentGroup.gr.grBorder.visible = this.active;
  this.parentGroup.gr.grBorder.onDraw = function () {
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
      event.preventDefault();
      this.onClick(event);

      this.lastClickEventTime = event.timeStamp.getTime();
      this.activate();
    }, this),
    // true,
  );

  this.element.window.addEventListener(
    "mousedown",
    bind(function (event) {
      if (event.timeStamp.getTime() !== this.lastClickEventTime) {
        this.deactivate();
      }
    }, this),
  );

  this.element.window.addEventListener(
    "keyup",
    bind(function (event) {
      if (this.active && event.eventPhase === "target") {
        if (event.keyName === "Delete") {
          this.deleteSelectedRows();
        } else if (event.keyName === "Enter") {
          this.editSelectedRow();
        }
      }
    }, this),
  );

  this.element.window.addEventListener(
    "show",
    bind(function () {
      this.updateScrollBar();
    }, this),
  );

  this.parentGroup.grButtons.btnNew.onClick = bind(function () {
    this.new();
  }, this);

  this.parentGroup.grButtons.btnEdit.onClick = bind(function () {
    this.editSelectedRow();
  }, this);

  this.parentGroup.grButtons.btnDelete.onClick = bind(function () {
    this.deleteSelectedRows();
  }, this);

  this.element.graphics.backgroundColor = this.element.graphics.newBrush(
    this.element.graphics.BrushType.SOLID_COLOR,
    [0.164, 0.164, 0.164, 1],
  );

  this.updateButtons();
}

List.BUTTONS_POSITION = {
  LEFT: 0,
  RIGHT: 1,
  BOTTOM: 2,
};

List.prototype.setButtonsPosition = function (pos) {
  if (pos === List.BUTTONS_POSITION.RIGHT) {
    this.parentGroup.orientation = "row";
    this.parentGroup.grButtons.orientation = "column";
    this.parentGroup.grButtons.alignment = ["right", "top"];
  } else if (pos === List.BUTTONS_POSITION.BOTTOM) {
    this.parentGroup.orientation = "column";
    this.parentGroup.grButtons.orientation = "row";
    this.parentGroup.grButtons.alignment = ["left", "bottom"];
  }
};

List.prototype.activate = function () {
  if (!this.active) {
    this.active = true;
    this.parentGroup.gr.grBorder.visible = true;
  }
};

List.prototype.deactivate = function () {
  if (this.active) {
    this.active = false;
    this.parentGroup.gr.grBorder.visible = false;
  }
};

List.prototype.setSize = function (size) {
  this.element.grList.size = size;
};

List.prototype.setMaxSize = function (maxSize) {
  this.element.grList.maximumSize = maxSize;
};

List.prototype.setMinSize = function (minSize) {
  this.element.grList.minimumSize = minSize;
};

List.prototype.new = function () {
  for (var i = 0; i < this.rows.length; i++) {
    if (this.rows[i].editing && this.rows[i].abortEditHandler) {
      this.rows[i].abortEditHandler();
    }
  }

  var newRow = this.addRow();

  this.element.layout.layout(true);
  this.updateScrollBar();
  this.scrollToBottom();
  this.deselectAllRows();
  this.selectRow(this.rows.length - 1);

  if (newRow.editHandler) {
    newRow.editHandler(this);
  }
};

List.prototype.addRow = function (content) {
  var row = new this.RowClass(this.element.grList.grRows);

  if (typeof row.fillHandler === "function") {
    row.fillHandler(content);
  }

  this.rows.push(row);
  return row;
};

List.prototype.editSelectedRow = function () {
  if (this.selectedRows.length > 0) {
    var lastSelectedRow =
      this.rows[this.selectedRows[this.selectedRows.length - 1]];

    if (lastSelectedRow.editHandler) {
      lastSelectedRow.editHandler();
    }
  }
};

List.prototype.deleteRow = function (row) {
  row = typeof row === "number" ? this.rows[row] : row;
  var rowIndex = row === "number" ? row : indexOf(this.rows, row);
  var indInSelectedRows = indexOf(this.selectedRows, rowIndex);

  if (row.element && isValid(row.element)) {
    this.element.grList.grRows.remove(row.element);
  }

  if (rowIndex !== -1) {
    this.rows.splice(rowIndex, 1);
  }

  if (indInSelectedRows !== -1) {
    this.selectedRows.splice(indInSelectedRows, 1);
  }

  this.element.layout.layout(true);
  this.updateScrollBar();
  this.updateButtons();
};

List.prototype.deleteSelectedRows = function () {
  this.selectedRows.sort(function (a, b) {
    return a - b;
  });

  for (var i = this.selectedRows.length - 1; i >= 0; i--) {
    this.element.grList.grRows.remove(this.rows[this.selectedRows[i]].element);
    this.rows.splice(this.selectedRows[i], 1);
  }

  if (
    this.lastClickedRowInd !== undefined &&
    indexOf(this.selectedRows, this.lastClickedRowInd) !== -1
  ) {
    this.lastClickedRowInd = 0;
  }

  var newSelectInd;
  if (this.selectedRows.length === 1) {
    newSelectInd = this.selectedRows[0];
  }

  this.selectedRows.length = 0;

  if (newSelectInd !== undefined) {
    this.selectRow(newSelectInd);
  }

  this.element.layout.layout(true);
  this.updateScrollBar();
  this.updateButtons();
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
        start: this.lastClickedRowInd || 0,
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
  } else {
    this.deselectAllRows();
  }
};

List.prototype.updateButtons = function () {
  if (this.selectedRows.length === 0) {
    this.parentGroup.grButtons.btnEdit.enabled = false;
    this.parentGroup.grButtons.btnDelete.enabled = false;
  } else {
    this.parentGroup.grButtons.btnEdit.enabled = true;
    this.parentGroup.grButtons.btnDelete.enabled = true;
  }
};

List.prototype.selectRow = function (rowIndex) {
  if (
    rowIndex < this.rows.length &&
    indexOf(this.selectedRows, rowIndex) === -1
  ) {
    var row = this.rows[rowIndex];
    row.setBgColor(this.colorSelected);

    this.selectedRows.push(rowIndex);
    this.updateButtons();
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
    row.setBgColor(this.colorDeselected);

    this.selectedRows.splice(ind, 1);
    this.updateButtons();
  }
};

List.prototype.deselectAllRows = function () {
  for (var i = 0; i < this.selectedRows.length; i++) {
    this.rows[this.selectedRows[i]].setBgColor(this.colorDeselected);
  }

  this.selectedRows.length = 0;
  this.updateButtons();
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
    this.element.layout.layout(true);
  }

  var scrollBar = this.element.scrollBar;
  var grSlider = this.element.grList.grSlider;
  var sizeDiff =
    this.element.grList.grRows.size.height - this.element.grList.size.height;

  var moveSliderGroup = function (event) {
    if (this.grSlider) {
      this.grSlider.location.x = event.clientX;
      this.grSlider.location.y = event.clientY;
    }
  };

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
        this.element.grList.addEventListener("mousemove", moveSliderGroup);
      }
    }

    this.element.layout.layout(true);
    this.element.layout.resize();

    scrollBar.minvalue = 0;
    scrollBar.maxvalue = sizeDiff;
    scrollBar.notify();
  } else if (scrollBar) {
    this.element.remove(scrollBar);
    this.element.scrollBar = undefined;
    this.element.grList.removeEventListener("mousemove", moveSliderGroup);

    if (grSlider) {
      this.element.grList.remove(grSlider);
      this.element.grList.grSlider = undefined;
    }

    this.element.layout.layout(true);
    this.element.layout.resize();
  }
};

List.prototype.scrollToBottom = function () {
  var scrollBar = this.element.scrollBar;

  if (scrollBar) {
    scrollBar.value = scrollBar.maxvalue;
    scrollBar.notify();
  }
};

export default List;
