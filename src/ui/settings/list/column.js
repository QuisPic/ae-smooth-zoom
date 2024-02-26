function Column(parentEl, name) {
  this.name = name;
  this.rows = [];

  this.rowMargins = [5, 2, 0, 2];

  this.element = parentEl.add(
    "Group { \
      orientation: 'column', \
      alignChildren: 'left', \
      spacing: 0, \
      grName: Group {}, \
      grRows: Group { \
        orientation: 'column', \
        alignChildren: 'fill', \
        spacing: 0, \
      }, \
    }",
  );
}

Column.prototype.getHeight = function () {
  var lastRow = this.rows[this.rows.length - 1];

  return lastRow.location.y + lastRow.size.height;
};

Column.prototype.displayName = function () {
  if (this.element.grName.txtName) {
    this.removeName();
  }

  this.element.grName.txtName = this.element.grName.add(
    "StaticText { text: '" + this.name + "' }",
  );
};

Column.prototype.removeName = function () {
  if (this.element.grName.txtName) {
    this.element.grName.remove(this.element.grName.txtName);
  }
};

Column.prototype.setOnAllRows = function (key, value) {
  for (var i = 0; i < this.rows.length; i++) {
    this.rows[i][key] = value;
  }
};

Column.prototype.setRowHeight = function (rowHeight) {
  this.rowHeight = rowHeight;
  this.setOnAllRows("minimumSize", [0, rowHeight]);
};

Column.prototype.setRowMargins = function (rowMargins) {
  this.rowMargins = rowMargins;
  this.setOnAllRows("margins", rowMargins);
};

Column.prototype.addRow = function (element) {
  var rowGroup = this.element.grRows.add(
    "Group { \
      alignChildren: ['left', 'center'], \
    }",
  );

  if (this.rowHeight !== undefined) {
    rowGroup.minimumSize = [0, this.rowHeight];
  }

  if (this.rowMargins !== undefined) {
    rowGroup.margins = this.rowMargins;
  }

  if (typeof element === "string") {
    rowGroup.element = rowGroup.add(element);
  } else if (typeof element === "function") {
    rowGroup.element = new element(rowGroup);
  }

  this.rows.push(rowGroup);
  return rowGroup;
};

export default Column;
