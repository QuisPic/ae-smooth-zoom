function Line(parentEl) {
  this.element = parentEl.add(
    "Group {\
      orientation: '" +
      parentEl.orientation +
      "', \
      alignment: 'fill', \
      alignChildren: 'fill', \
      cLine: Custom {}, \
    }",
  );

  if (this.element.parent.orientation === "column") {
    this.element.cLine.preferredSize = [-1, 1];
  } else {
    this.element.cLine.preferredSize = [1, -1];
  }

  this.element.cLine.onDraw = function () {
    if (!parentEl.size) {
      parentEl.layout.layout(true);
    }

    var g = this.graphics;
    var c = [0.3, 0.3, 0.3, 1];
    var p = g.newPen(g.PenType.SOLID_COLOR, c, 1);

    if (this.parent.orientation === "column") {
      g.moveTo(0, 0);
      g.lineTo(this.size[0], 0);
      g.strokePath(p);
    } else {
      g.moveTo(0, 0);
      g.lineTo(0, this.size[1]);
      g.strokePath(p);
    }
  };
}

Line.prototype.forceOnDraw = function () {
  this.element.cLine.notify("onDraw");
};

export default Line;
