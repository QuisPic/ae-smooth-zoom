import { OS, BLUE_COLOR, AE_OS } from "../constants";
import { isNaN, makeDivisibleBy } from "../utils";
import bind from "../../extern/function-bind";
import ScreenWindow from "./screen-window";
import FloatEditText from "./float-edit-text";

function NumberValue(
  parentEl,
  unitsSymbol,
  initValue,
  minValue,
  maxValue,
  onChangeFn,
  onScrubStartFn,
  onScrubEndFn,
  helpTip,
) {
  this.w =
    parentEl instanceof Window || parentEl instanceof Panel
      ? parentEl
      : parentEl.window;
  this.parentEl = parentEl;
  this.minValue = minValue;
  this.maxValue = maxValue;
  this.onChangeFn = onChangeFn;
  this.screenWin = undefined;
  this.lastMousePosition = [0, 0];

  this.element = parentEl.add(
    "Group { \
      orientation: 'stack', \
      alignChildren: ['left', 'center'], \
      grValue: Group { \
        alignChildren: ['left', 'fill'], \
        spacing: 0, \
        grText: Group { \
          margins: [6, 2, 0, 0], \
          orientation: 'stack', \
          alignChildren: ['fill', 'fill'], \
          grUnderline: Group { visible: false }, \
          txtValue: StaticText { \
            text: '0', \
            helpTip: '" +
      (helpTip || "") +
      "' \
          }, \
        }, \
        grSpace: Group { preferredSize: [2, -1], alignment: ['fill', 'fill'] }, \
        txtUnits: StaticText { text: '" +
      unitsSymbol +
      "' }, \
      }, \
    }",
  );

  var thisNumberValue = this;
  var grValue = this.element.grValue;
  var grText = grValue.grText;
  var txtUnits = grValue.txtUnits;
  var grSpace = grValue.grSpace;
  var txtValue = grText.txtValue;
  var grUnderline = grText.grUnderline;
  var isMouseDown = false;

  var g = txtUnits.graphics;
  var lightPen = g.newPen(g.PenType.SOLID_COLOR, [0.75, 0.75, 0.75, 1], 1);
  var darkPen = g.newPen(g.PenType.SOLID_COLOR, [0.55, 0.55, 0.55, 1], 1);
  var bluePen = g.newPen(g.PenType.SOLID_COLOR, BLUE_COLOR, 2);

  if (initValue !== undefined && !isNaN(parseFloat(initValue))) {
    txtValue.text = parseFloat(initValue);
  }

  txtValue.graphics.foregroundColor = bluePen;
  this.element.minimumSize = this.element.graphics.measureString("00000000");

  grValue.addEventListener(
    "mousedown",
    bind(function (event) {
      if (event.eventPhase === "target") {
        isMouseDown = true;
        this.lastMousePosition = [event.screenX, event.screenY];
      }
    }, this),
  );

  grValue.addEventListener(
    "mouseup",
    bind(function (event) {
      if (event.eventPhase === "target" && isMouseDown) {
        isMouseDown = false;

        var editText = new FloatEditText(this.element, txtValue.text);

        editText.setSize([
          editText.element.graphics.measureString("000000")[0],
          thisNumberValue.element.size[1],
        ]);

        editText.setOnChangeFn(
          bind(function (txt) {
            var newValue = parseFloat(txt);

            if (!isNaN(newValue) && typeof this.onChangeFn === "function") {
              this.onChangeFn(newValue);
            }
          }, this),
        );

        editText.setOnBlurFn(
          bind(function (txt) {
            var newValue = txt ? parseFloat(txt) : this.getValue();

            if (!isNaN(newValue)) {
              this.setValue(newValue);
              this.onChange();
            }

            this.element.remove(editText.element);
            grValue.show();
          }, this),
        );

        grValue.hide();
        this.element.layout.layout(true);
      }
    }, this),
  );

  grValue.addEventListener(
    "mousemove",
    bind(function (event) {
      if (
        event.eventPhase === "target" &&
        isMouseDown &&
        Math.abs(event.screenX - this.lastMousePosition[0]) >= 3
      ) {
        if (typeof onScrubStartFn === "function") {
          onScrubStartFn();
        }

        grUnderline.show();

        var onMouseMoveFn = bind(function (event) {
          if (event.eventPhase === "target") {
            var mouseDistance = Math.floor(
              event.screenX - this.lastMousePosition[0],
            );

            var ctrlKey = AE_OS === OS.WIN ? event.ctrlKey : event.metaKey;
            var shiftKey = event.shiftKey;

            if (Math.abs(mouseDistance) >= 1) {
              if (shiftKey) {
                mouseDistance *= 10;
              } else if (ctrlKey) {
                mouseDistance /= 10;
              }

              var newValue = this.getValue() + mouseDistance;

              if (!ctrlKey) {
                newValue = makeDivisibleBy(newValue, 1, mouseDistance < 0);
              }

              if (shiftKey) {
                newValue = makeDivisibleBy(newValue, 10, mouseDistance < 0);
              }

              this.setValue(newValue);
              this.onChange();
              this.lastMousePosition = [event.screenX, event.screenY];
            }
          }
        }, this);

        var onCloseFn = bind(function () {
          if (this.screenWin && this.screenWin.element.visible) {
            this.screenWin.element.close();
          }

          grUnderline.hide();

          if (typeof onScrubEndFn === "function") {
            onScrubEndFn();
          }
        }, this);

        this.screenWin = undefined;
        for (var i = 0; i < $.screens.length; i++) {
          // if the screen contains the cursor
          if (
            this.lastMousePosition[0] >= $.screens[i].left &&
            this.lastMousePosition[0] <= $.screens[i].right &&
            this.lastMousePosition[1] >= $.screens[i].top &&
            this.lastMousePosition[1] <= $.screens[i].bottom
          ) {
            this.screenWin = new ScreenWindow(
              this,
              $.screens[i],
              onMouseMoveFn,
              onCloseFn,
            );

            break;
          }
        }

        isMouseDown = false;
      }
    }, this),
  );

  grText.addEventListener("mouseover", function () {
    txtUnits.graphics.foregroundColor = lightPen;
  });

  grText.addEventListener("mouseout", function () {
    txtUnits.graphics.foregroundColor = darkPen;
  });

  // add fully transparent color to this empty group so that the parent group
  // has no "holes" on which the "mouseover" event is not fired
  grSpace.graphics.backgroundColor = grSpace.graphics.newBrush(
    grSpace.graphics.BrushType.SOLID_COLOR,
    [0, 0, 0, 0],
  );

  grUnderline.onDraw = function () {
    var g = this.graphics;

    g.moveTo(0, this.size[1]);
    g.lineTo(this.size[0], this.size[1]);
    g.strokePath(bluePen);
  };
}

NumberValue.prototype.getValue = function () {
  return parseFloat(this.element.grValue.grText.txtValue.text);
};

NumberValue.prototype.setValue = function (val) {
  if (this.minValue !== undefined) {
    val = val < this.minValue ? this.minValue : val;
  }

  if (this.maxValue !== undefined) {
    val = val > this.maxValue ? this.maxValue : val;
  }

  var txt = this.element.grValue.grText.txtValue;

  txt.text = val;
  txt.size = txt.graphics.measureString(val);

  this.element.layout.layout(true);
};

NumberValue.prototype.onChange = function () {
  if (typeof this.onChangeFn === "function") {
    this.onChangeFn(this.getValue());
  }
};

export default NumberValue;
