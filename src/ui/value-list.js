import preferences from "../preferences";
import JSON from "../../extern/json2";
import { STICK_TO } from "../constants";
import MenuWindow from "./menu-window";

function ValueList(parentEl, onChangeFn, targetEl, stickTo) {
  var thisValueList = this;
  this.targetEl = targetEl;
  stickTo = stickTo || STICK_TO.LEFT;

  this.element = parentEl.add(
    "Group { \
      alignment: ['left', 'center'], \
      icon: Custom { \
        preferredSize: [20, 20], \
      }, \
    }",
  );

  function handleIconMouseOver(event) {
    if (event.eventPhase === "target") {
      this.notify("onDraw");
    }
  }

  this.element.icon.addEventListener("mouseover", handleIconMouseOver);
  this.element.icon.addEventListener("mouseout", handleIconMouseOver);

  this.element.icon.onDraw = function (drawState) {
    var g = this.graphics;
    var c = drawState.mouseOver ? [0.75, 0.75, 0.75, 1] : [0.55, 0.55, 0.55, 1];

    g.moveTo(7, 7);
    g.lineTo(10, 13);
    g.lineTo(13, 7);
    g.closePath();
    g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, c));
  };

  this.element.addEventListener("click", function (event) {
    function createOnClickFn(val) {
      if (typeof onChangeFn === "function") {
        return function () {
          onChangeFn(val);
        };
      }
    }

    if (event.eventPhase === "target") {
      var listWindow = new MenuWindow();

      var valuesArr =
        typeof preferences.presetValues === "string"
          ? JSON.parse(preferences.presetValues)
          : preferences.presetValues;

      for (var i = 0; i < valuesArr.length; i++) {
        listWindow.addMenuItem(
          valuesArr[i] + "%",
          createOnClickFn(valuesArr[i]),
        );
      }

      listWindow.element.opacity = 0;
      listWindow.element.show();
      listWindow.stickTo(this, stickTo, event, thisValueList.targetEl);
      listWindow.element.opacity = 1;
    }
  });
}

export default ValueList;
