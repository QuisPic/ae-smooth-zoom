import MenuWindow from "./menu-window";

function ValueList(zoom, parentEl, onChangeFn) {
  var thisValueList = this;
  this.targetEl = zoom.zoomNumberValue.element;

  this.element = parentEl.add(
    "Group { \
      alignment: ['left', 'center'], \
      preferredSize: [20, 20], \
    }",
  );

  this.element.onDraw = function () {
    var g = this.graphics;

    g.moveTo(7, 7);
    g.lineTo(10, 13);
    g.lineTo(13, 7);
    g.closePath();
    g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, [0.57, 0.57, 0.57, 1]));
  };

  this.element.addEventListener("click", function (event) {
    if (event.eventPhase === "target") {
      var listWindow = new MenuWindow();
      var ZOOM_VALUES = [
        1.5, 3.1, 6.25, 12.5, 25, 33.3, 50, 100, 200, 400, 800, 1600, 3200,
        6400,
      ];

      function createOnClickFn(val) {
        return function () {
          if (typeof onChangeFn === "function") {
            onChangeFn(val);
          }

          listWindow.element.close();
        };
      }

      for (var i = 0; i < ZOOM_VALUES.length; i++) {
        listWindow.addMenuItem(
          ZOOM_VALUES[i] + "%",
          createOnClickFn(ZOOM_VALUES[i]),
        );
      }

      listWindow.element.opacity = 0;
      listWindow.element.show();
      listWindow.stickTo(this, true, event, thisValueList.targetEl);
      listWindow.element.opacity = 1;
    }
  });
}

export default ValueList;
