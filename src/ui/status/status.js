import bind from "../../../extern/function-bind";
import { UI_STATUS } from "../../constants";

function Status(parentEl) {
  this.status = UI_STATUS.ERROR;
  this.element = parentEl.add(
    "Panel { \
      alignChildren: 'fill', \
      grStatus: Group { \
        alignChildren: ['fill', 'center'], \
        gr: Group { \
          spacing: 6, \
          statusIcon: Group { \
            margins: [0, 4, 0, 0], \
            alignment: ['left', 'fill'], \
            icon: Group { \
              preferredSize: [8, 8], \
              alignment: ['left', 'top'], \
            }, \
          }, \
          grText: Group { \
            alignment: ['fill', 'top'], \
            alignChildren: ['left', 'top'], \
            orientation: 'column', \
            spacing: 0, \
          }, \
        }, \
      }, \
    }",
  );

  var grStatus = this.element.grStatus;
  var statusIcon = grStatus.gr.statusIcon.icon;

  statusIcon.onDraw = bind(function () {
    var g = statusIcon.graphics;
    var c = this.status === UI_STATUS.OK ? [0.1, 0.85, 0.1, 1] : [1, 0, 0, 1];
    var p = g.newPen(g.PenType.SOLID_COLOR, c, 2);

    if (this.status === UI_STATUS.OK) {
      g.moveTo(0, 3);
      g.lineTo(3, 6);
      g.lineTo(8, 0);
    } else {
      g.moveTo(0, 0);
      g.lineTo(8, 8);
      g.strokePath(p);

      g.currentPath = g.newPath();

      g.moveTo(8, 0);
      g.lineTo(0, 8);
    }

    g.strokePath(p);
  }, this);
}

Status.prototype.setStatusError = function () {
  this.set(UI_STATUS.ERROR);
};

Status.prototype.setStatusOK = function () {
  this.set(UI_STATUS.OK);
};

Status.prototype.set = function (status) {
  this.status = status;

  this.element.graphics.backgroundColor = this.element.graphics.newBrush(
    this.element.graphics.BrushType.SOLID_COLOR,
    this.status === UI_STATUS.OK ? [0.12, 0.2, 0.12, 1] : [0.2, 0.12, 0.12, 1],
  );
};

export default Status;
