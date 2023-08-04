function TrashIcon(parentEl, interactive, onClickFn) {
  this.element = parentEl.add(
    "Group { \
      icon: Custom { \
        preferredSize: [8, 12], \
      }, \
    }",
  );

  function handleMouseOver(event) {
    if (event.eventPhase === "target") {
      this.icon.notify("onDraw");
    }
  }

  if (interactive) {
    this.element.addEventListener("mouseover", handleMouseOver);
    this.element.addEventListener("mouseout", handleMouseOver);
  }

  this.element.icon.onDraw = function (drawState) {
    var g = this.graphics;
    var c = drawState.mouseOver ? [0.75, 0.75, 0.75, 1] : [0.55, 0.55, 0.55, 1];
    var b = g.newBrush(g.BrushType.SOLID_COLOR, c);

    g.rectPath(0, 4, 8, 2);
    g.fillPath(b);
    g.rectPath(0, 5, 2, 6);
    g.fillPath(b);
    g.rectPath(3, 5, 2, 6);
    g.fillPath(b);
    g.rectPath(6, 5, 2, 6);
    g.fillPath(b);
    g.rectPath(0, 10, 8, 2);
    g.fillPath(b);

    g.newPath();
    g.moveTo(0, 3);
    g.lineTo.apply(g, g.currentPoint + [0, -2]);
    g.lineTo.apply(g, g.currentPoint + [3, 0]);
    g.lineTo.apply(g, g.currentPoint + [0, -1]);
    g.lineTo.apply(g, g.currentPoint + [2, 0]);
    g.lineTo.apply(g, g.currentPoint + [0, 1]);
    g.lineTo.apply(g, g.currentPoint + [3, 0]);
    g.lineTo.apply(g, g.currentPoint + [0, 2]);
    g.fillPath(b);
  };

  if (typeof onClickFn === "function") {
    this.element.addEventListener("click", function (event) {
      onClickFn(event);
    });
  }
}

export default TrashIcon;
