import indexOf from "../../../../extern/array-indexOf";

function Row(list) {
  this.list = list;
  this.columns = [];
  this.minSize = [0, 0];
  this.columnMargins = undefined;
  this.columnAlignments = undefined;
  this.colorSelected = [0.27, 0.27, 0.27, 1];
  this.colorDeselected = [0.113, 0.113, 0.113, 1];
  this.editing = false;

  this.element = list.grRows.add(
    "Group { \
      alignment: ['fill', 'top'], \
      alignChildren: ['left', 'fill'], \
      spacing: 0, \
    }",
  );

  this.setBgColor([0.113, 0.113, 0.113, 1]);
}

Row.prototype.onClickHandler = undefined;
Row.prototype.onDoubleClickHandler = undefined;
Row.prototype.fillHandler = undefined;
Row.prototype.editHandler = undefined;
Row.prototype.abortEditHandler = undefined;

Row.prototype.setOnAllColumns = function (key, value) {
  for (var i = 0; i < this.columns.length; i++) {
    this.columns[i][key] = value;
  }
};

Row.prototype.setColumnWidths = function (widths) {
  for (var i = 0; i < this.columns.length; i++) {
    if (widths[i] !== undefined) {
      this.columns[i].minimumSize = [widths[i], 0];
    }
  }
};

Row.prototype.setMinSize = function (minSize) {
  this.minSize = minSize;
  this.element.minimumSize = minSize;
  this.setOnAllColumns("minimumSize", this.minSize);
};

Row.prototype.setColumnMargins = function (columnMargins) {
  this.columnMargins = columnMargins;
  this.setOnAllColumns("margins", columnMargins);
};

Row.prototype.add = function (element) {
  var columnGroup = this.element.add(
    "Group { \
      alignChildren: ['fill', 'fill'], \
    }",
  );

  columnGroup.minimumSize = this.minSize;

  if (typeof element === "string") {
    columnGroup.element = columnGroup.add(element);
  } else if (typeof element === "function") {
    columnGroup.element = element(columnGroup);
  }

  this.columns.push(columnGroup);

  return columnGroup;
};

Row.prototype.edit = function (content) {
  var indInList = indexOf(this.list.rows, this);
  if (indInList !== -1) {
    this.list.contents[indInList] = content;

    if (this.list.onChangeHandler) {
      this.list.onChangeHandler();
    }
  }

  this.clear();

  if (typeof this.fillHandler === "function") {
    this.fillHandler(content);
  }

  if (this.list.columnWidths.length > 0) {
    this.setColumnWidths(this.list.columnWidths);
  }

  this.element.layout.layout(true);
};

Row.prototype.clear = function () {
  for (var i = 0; i < this.columns.length; i++) {
    if (this.columns[i] && isValid(this.columns[i])) {
      this.element.remove(this.columns[i]);
    }
  }

  this.columns.length = 0;
};

Row.prototype.setBgColor = function (color) {
  this.element.graphics.backgroundColor = this.element.graphics.newBrush(
    this.element.graphics.BrushType.SOLID_COLOR,
    color,
  );
};

Row.prototype.setColumnsBgColor = function (color) {
  for (var i = 0; i < this.columns.length; i++) {
    this.columns[i].graphics.backgroundColor = this.element.graphics.newBrush(
      this.element.graphics.BrushType.SOLID_COLOR,
      color,
    );
  }
};

Row.prototype.onClick = function (event) {
  if (this.onClickHandler) {
    var canCallDoubleClick = this.onClickHandler(event);
  }

  if (
    canCallDoubleClick !== false &&
    event.detail === 2 &&
    event.button === 0 &&
    this.onDoubleClickHandler
  ) {
    this.onDoubleClickHandler(event);
  }
};

Row.prototype.removeSelf = function () {
  if (this.element && isValid(this.element)) {
    this.element.parent.remove(this.element);
  }
};

/** override this function if you need custom colors */
Row.prototype.getColorSelected = function () {
  return this.colorSelected;
};

/** override this function if you need custom colors */
Row.prototype.getColorDeselected = function () {
  return this.colorDeselected;
};

export default Row;
