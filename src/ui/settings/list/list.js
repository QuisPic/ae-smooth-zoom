import bind from "../../../../extern/function-bind";
import { binarySearch, positionRelativeToParent } from "../../../utils";
import indexOf from "../../../../extern/array-indexOf";
import Row from "./row";
import { AE_OS, BLUE_COLOR, OS } from "../../../constants";
import { arrowDownIcon, arrowUpIcon } from "./icons-bin";

function List(parentEl) {
  this.RowClass = Row;
  this.ColumnNamesClass = undefined;
  this.active = false;
  this.columnNamesRow = undefined;
  this.columnWidths = [];
  this.lastClickEventTime = undefined;
  this.rows = [];
  this.contents = [];
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
        alignment: ['right', 'fill'], \
        orientation: 'column', \
        spacing: 5, \
        btnNew: IconButton { title: 'New', preferredSize: [90, 22] }, \
        btnEdit: IconButton { title: 'Edit', preferredSize: [90, 22] }, \
        btnDelete: IconButton { title: 'Delete', preferredSize: [90, 22] }, \
        btnMoveUp: IconButton { \
          preferredSize: [90, 22], \
          alignment: ['right', 'bottom'], \
          helpTip: 'Move Up', \
        }, \
        btnMoveDown: IconButton { \
          preferredSize: [90, 22], \
          alignment: ['right', 'bottom'], \
          helpTip: 'Move Down', \
        }, \
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
          margins: [0, 0, 0, 1], \
          alignment: ['fill', 'top'], \
          alignChildren: ['fill', 'top'], \
          spacing: 1, \
        }, \
      }, \
    }",
  );

  this.grRows = this.element.grList.grRows;
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
      if (
        event.timeStamp.getTime() !== this.lastClickEventTime &&
        indexOf(this.parentGroup.grButtons.children, event.target) === -1
      ) {
        this.deactivate();
        this.deselectAllRows();
      }
    }, this),
  );

  this.element.window.addEventListener(
    "keyup",
    bind(function (event) {
      if (this.active && event.eventPhase === "target") {
        if (event.keyName === "Delete") {
          this.deleteSelectedRows();
          this.refresh();
        } else if (event.keyName === "Enter") {
          this.editSelectedRow();
        }
      }
    }, this),
  );

  this.element.window.addEventListener(
    "show",
    bind(function () {
      this.refresh();
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
    this.refresh();
  }, this);

  this.element.graphics.backgroundColor = this.element.graphics.newBrush(
    this.element.graphics.BrushType.SOLID_COLOR,
    [0.113, 0.113, 0.113, 1],
  );

  this.element.grList.grRows.graphics.backgroundColor =
    this.element.graphics.newBrush(
      this.element.graphics.BrushType.SOLID_COLOR,
      [0.164, 0.164, 0.164, 1],
    );

  this.parentGroup.grButtons.btnMoveUp.icon = arrowUpIcon;
  this.parentGroup.grButtons.btnMoveDown.icon = arrowDownIcon;

  this.parentGroup.grButtons.btnMoveUp.onClick = bind(function () {
    this.moveSelectedRows(List.MOVE_ROW_DIRECTION.UP);
  }, this);
  this.parentGroup.grButtons.btnMoveDown.onClick = bind(function () {
    this.moveSelectedRows(List.MOVE_ROW_DIRECTION.DOWN);
  }, this);
}

List.BUTTONS_POSITION = {
  LEFT: 0,
  RIGHT: 1,
  BOTTOM: 2,
};

List.MOVE_ROW_DIRECTION = {
  UP: 0,
  DOWN: 1,
};

List.prototype.onChangeHandler = undefined;

List.prototype.setButtonsPosition = function (pos) {
  if (pos === List.BUTTONS_POSITION.RIGHT) {
    this.parentGroup.orientation = "row";
    this.parentGroup.grButtons.orientation = "column";
    this.parentGroup.grButtons.alignment = ["right", "fill"];
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
  // this.parentGroup.maximumSize = maxSize;
};

List.prototype.setMinSize = function (minSize) {
  this.element.grList.minimumSize = minSize;
  // this.parentGroup.minimumSize = minSize;
};

List.prototype.new = function () {
  for (var i = 0; i < this.rows.length; i++) {
    if (this.rows[i].editing && this.rows[i].abortEditHandler) {
      this.rows[i].abortEditHandler();
    }
  }

  this.contents.push(undefined);
  var newRow = this.addRow(this.contents.length - 1);

  this.refresh();
  this.scrollToBottom();
  this.deselectAllRows();
  this.selectRow(this.rows.length - 1);

  if (this.onChangeHandler) {
    this.onChangeHandler();
  }

  if (newRow.editHandler) {
    newRow.editHandler(this);
  }
};

List.prototype.addRow = function (index) {
  var row = new this.RowClass(this);

  if (typeof row.fillHandler === "function") {
    row.fillHandler(this.contents[index]);
  }

  if (this.columnWidths.length > 0) {
    row.setColumnWidths(this.columnWidths);
  }

  this.rows.push(row);
  return row;
};

List.prototype.build = function (fromIndex) {
  fromIndex = fromIndex === undefined ? 0 : fromIndex;

  for (var i = fromIndex; i < this.contents.length; i++) {
    this.addRow(i);
  }
};

List.prototype.moveSelectedRows = function (direction) {
  /** if there is less than 2 rows there's nowhere to move */
  if (this.rows.length < 2) {
    return;
  }

  if (this.selectedRows.length === 0) {
    return;
  }

  this.selectedRows.sort(function (a, b) {
    return a - b;
  });

  var numRows = this.selectedRows.length;
  var placePos = 0;
  var updateFromInd = 0;
  if (direction === List.MOVE_ROW_DIRECTION.UP) {
    placePos = this.selectedRows[0] - 1;
    placePos = placePos < 0 ? 0 : placePos;
    updateFromInd = placePos;
  } else if (direction === List.MOVE_ROW_DIRECTION.DOWN) {
    placePos =
      this.selectedRows[this.selectedRows.length - 1] + 1 - (numRows - 1);
    placePos =
      placePos > this.rows.length - numRows
        ? this.rows.length - numRows
        : placePos;
    updateFromInd = this.selectedRows[0];
  }

  var removedContent = [];
  for (i = 0; i < this.selectedRows.length; i++) {
    removedContent.push(this.contents[this.selectedRows[i]]);
  }

  for (var i = this.selectedRows.length - 1; i >= 0; i--) {
    var numRemove = 1;

    /** while prev selected row is exactly one row above */
    while (
      i - 1 >= 0 &&
      this.selectedRows[i] - this.selectedRows[i - 1] === 1
    ) {
      numRemove++;
      i--;
    }

    this.contents.splice(this.selectedRows[i], numRemove);
  }

  if (direction === List.MOVE_ROW_DIRECTION.UP) {
    removedContent = removedContent.concat(this.contents.slice(updateFromInd));
  } else if (direction === List.MOVE_ROW_DIRECTION.DOWN) {
    var newRemovedContent = this.contents.slice(updateFromInd);
    Array.prototype.splice.apply(
      newRemovedContent,
      [placePos - updateFromInd, 0].concat(removedContent),
    );

    removedContent = newRemovedContent;
  }

  this.deleteRowRange(updateFromInd);

  Array.prototype.splice.apply(
    this.contents,
    [placePos, 0].concat(removedContent),
  );

  this.build(updateFromInd);
  this.selectRowRange(placePos, placePos + numRows - 1);
  this.lastClickedRowInd = placePos;
  this.refresh();

  if (this.onChangeHandler) {
    this.onChangeHandler();
  }
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

List.prototype.refresh = function () {
  if (this.rows.length === 0) {
    this.grRows.hide();
  } else if (!this.grRows.visible) {
    this.grRows.show();
  }

  this.element.layout.layout(true);
  this.updateScrollBar();
  this.resizeColumns();
  this.element.layout.resize();
  this.updateButtons();
};

List.prototype.deleteRow = function (row) {
  row = typeof row === "number" ? this.rows[row] : row;
  var rowIndex = row === "number" ? row : indexOf(this.rows, row);

  if (!row || rowIndex === -1) {
    return;
  }

  var indInSelectedRows = indexOf(this.selectedRows, rowIndex);

  if (row.element && isValid(row.element)) {
    this.element.grList.grRows.remove(row.element);
  }

  if (rowIndex !== -1) {
    this.rows.splice(rowIndex, 1);
    this.contents.splice(rowIndex, 1);
  }

  if (indInSelectedRows !== -1) {
    this.selectedRows.splice(indInSelectedRows, 1);
  }

  if (rowIndex === this.lastClickedRowInd) {
    this.lastClickedRowInd = 0;
  }

  if (this.onChangeHandler) {
    this.onChangeHandler();
  }
};

List.prototype.deleteSelectedRows = function () {
  this.selectedRows.sort(function (a, b) {
    return a - b;
  });

  var newSelectInd;
  if (this.selectedRows.length === 1) {
    newSelectInd = this.selectedRows[0];
  }

  for (var i = this.selectedRows.length - 1; i >= 0; i--) {
    this.deleteRow(this.selectedRows[i]);
  }

  if (this.rows.length > 0 && newSelectInd !== undefined) {
    if (newSelectInd > this.rows.length - 1) {
      newSelectInd = this.rows.length - 1;
    }

    this.selectRow(newSelectInd);
    this.lastClickedRowInd = newSelectInd;
  }
};

List.prototype.deleteRowRange = function (fromInd, toInd) {
  fromInd = fromInd === undefined ? 0 : fromInd;
  toInd = toInd === undefined ? this.rows.length - 1 : toInd;

  if (fromInd > toInd) {
    var tmp = fromInd;
    fromInd = toInd;
    toInd = tmp;
  }

  for (var i = toInd; i >= fromInd; i--) {
    this.deleteRow(i);
  }
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
      this.selectRowRange(selectRange.start, selectRange.end);
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
    this.parentGroup.grButtons.btnMoveUp.enabled = false;
    this.parentGroup.grButtons.btnMoveDown.enabled = false;
  } else {
    this.parentGroup.grButtons.btnEdit.enabled = true;
    this.parentGroup.grButtons.btnDelete.enabled = true;
    this.parentGroup.grButtons.btnMoveUp.enabled = true;
    this.parentGroup.grButtons.btnMoveDown.enabled = true;
  }
};

List.prototype.selectRow = function (rowIndex) {
  if (
    rowIndex >= 0 &&
    rowIndex < this.rows.length &&
    indexOf(this.selectedRows, rowIndex) === -1
  ) {
    var row = this.rows[rowIndex];
    row.setBgColor(this.colorSelected);

    this.selectedRows.push(rowIndex);
    this.updateButtons();
  }
};

List.prototype.selectRowRange = function (fromInd, toInd) {
  fromInd = fromInd === undefined ? 0 : fromInd;
  toInd = toInd === undefined ? this.rows.length - 1 : toInd;

  var iDiff = fromInd < toInd ? 1 : -1;

  for (var i = fromInd; iDiff > 0 ? i <= toInd : i >= toInd; i += iDiff) {
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
    // this.element.layout.resize();
  }
};

List.prototype.scrollToBottom = function () {
  var scrollBar = this.element.scrollBar;

  if (scrollBar) {
    scrollBar.value = scrollBar.maxvalue;
    scrollBar.notify();
  }
};

List.prototype.resizeColumns = function () {
  var fillMaxWidths = bind(function (row) {
    for (var k = 0; k < row.columns.length; k++) {
      if (
        !this.columnWidths[k] ||
        row.columns[k].size.width > this.columnWidths[k]
      ) {
        this.columnWidths[k] = row.columns[k].size.width;
      }
    }
  }, this);

  if (this.columnNamesRow) {
    fillMaxWidths(this.columnNamesRow);
  }

  for (var i = 0; i < this.rows.length; i++) {
    fillMaxWidths(this.rows[i]);
  }

  if (this.columnNamesRow) {
    this.columnNamesRow.setColumnWidths(this.columnWidths);
  }

  for (i = 0; i < this.rows.length; i++) {
    this.rows[i].setColumnWidths(this.columnWidths);
  }
};

List.prototype.addColumnNames = function (names) {
  if (this.ColumnNamesClass) {
    this.columnNamesRow = new this.ColumnNamesClass(this);
    this.columnNamesRow.fillHandler(names);
  }
};

export default List;
