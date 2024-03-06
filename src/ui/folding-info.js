import bind from "../../extern/function-bind";
import Line from "./line";

function FoldingInfo(parentEl, unfoldEl, title) {
  this.unfoldEl = unfoldEl;

  this.element = parentEl.add(
    "Panel { \
      alignChildren: 'fill', \
      grTitle: Group {\
        spacing: 6, \
        foldIcon: Custom { preferredSize: [8, 8] }, \
        txt: StaticText {}, \
      }, \
    }",
  );

  this.element.grTitle.txt.text = title;

  var foldIcon = this.element.grTitle.foldIcon;

  this.element.grTitle.addEventListener(
    "click",
    bind(function (event) {
      if (event.eventPhase === "target") {
        this.toggleInfo();
        foldIcon.notify("onDraw");
      }
    }, this),
  );

  foldIcon.onDraw = bind(function () {
    var g = this.element.grTitle.foldIcon.graphics;
    var c = this.element.isMouseOver
      ? [0.75, 0.75, 0.75, 1]
      : [0.55, 0.55, 0.55, 1];
    var b = g.newPen(g.PenType.SOLID_COLOR, c, 2);

    if (this.isUnfoldInfo) {
      g.moveTo(0, 2);
      g.lineTo(4, 6);
      g.lineTo(8, 2);
    } else {
      g.moveTo(0, 0);
      g.lineTo(4, 4);
      g.lineTo(0, 8);
    }

    g.strokePath(b);
  }, this);

  this.element.grTitle.addEventListener(
    "mouseover",
    bind(function (event) {
      if (event.eventPhase === "target") {
        this.element.isMouseOver = true;
        foldIcon.notify("onDraw");
      }
    }, this),
  );

  this.element.grTitle.addEventListener(
    "mouseout",
    bind(function (event) {
      if (event.eventPhase === "target") {
        this.element.isMouseOver = false;
        foldIcon.notify("onDraw");
      }
    }, this),
  );
}

FoldingInfo.prototype.toggleInfo = function () {
  if (this.isUnfoldInfo) {
    this.foldInfo();
  } else {
    this.unfoldInfo();
  }

  this.element.parent.layout.layout(true);
  this.element.parent.layout.resize();
};

FoldingInfo.prototype.unfoldInfo = function () {
  if (this.isUnfoldInfo) {
    this.foldInfo();
  }

  var grInfo = this.element.add(
    "Group { \
        orientation: 'column', \
        alignChildren: ['fill', 'fill'], \
        grLine: Group { alignment: 'fill', orientation: 'column' }, \
    }",
  );

  Line(grInfo.grLine);

  if (typeof this.unfoldEl === "string") {
    grInfo.add(this.unfoldEl);
  } else if (typeof this.unfoldEl === "function") {
    this.unfoldEl(grInfo);
  }

  this.element.grInfo = grInfo;
  this.isUnfoldInfo = true;
};

FoldingInfo.prototype.foldInfo = function () {
  if (!this.isUnfoldInfo) {
    return;
  }

  var grInfo = this.element.grInfo;

  if (grInfo && isValid(grInfo)) {
    grInfo.parent.remove(grInfo);
  }

  this.isUnfoldInfo = false;
};

export default FoldingInfo;
