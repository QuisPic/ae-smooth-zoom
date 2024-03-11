import bind from "../../../../extern/function-bind";
import Row from "./row";

function BasicList(parentEl) {
  this.RowClass = Row;
  this.ColumnNamesClass = undefined;
  this.columnNamesRow = undefined;
  this.contents = [];
  this.rows = [];
  this.columnWidths = [];

  this.parentGroup = parentEl.add(
    "Group { \
      orientation: 'row', \
      alignChildren: ['fill', 'top'], \
      gr: Group { \
        orientation: 'stack', \
        alignment: ['fill', 'fill'], \
        alignChildren: 'fill', \
        grBorder: Group { visible: false }, \
        grElement: Group { \
          margins: 1, \
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

  this.element.graphics.backgroundColor = this.element.graphics.newBrush(
    this.element.graphics.BrushType.SOLID_COLOR,
    [0.113, 0.113, 0.113, 1],
  );

  this.element.grList.grRows.graphics.backgroundColor =
    this.element.graphics.newBrush(
      this.element.graphics.BrushType.SOLID_COLOR,
      [0.164, 0.164, 0.164, 1],
    );

  this.element.window.addEventListener(
    "show",
    bind(function () {
      this.refresh();
    }, this),
  );
}

BasicList.prototype.addRow = function (index) {
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

BasicList.prototype.build = function (fromIndex) {
  fromIndex = fromIndex === undefined ? 0 : fromIndex;

  for (var i = fromIndex; i < this.contents.length; i++) {
    this.addRow(i);
  }
};

BasicList.prototype.refresh = function () {
  this.element.layout.layout(true);
  this.resizeColumns();
  this.element.layout.resize();
};

BasicList.prototype.resizeColumns = function () {
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

BasicList.prototype.addColumnNames = function (names) {
  if (this.ColumnNamesClass) {
    this.columnNamesRow = new this.ColumnNamesClass(this);
    this.columnNamesRow.fillHandler(names);
  }
};

export default BasicList;
