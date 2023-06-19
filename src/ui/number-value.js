import { OS, BLUE_COLOR } from "../constants";
import { checkOs, isNaN, makeDivisibleBy } from "../utils";

function NumberValue(
  zoom,
  parentEl,
  onChangeFn,
  onScrubStartFn,
  onScrubEndFn,
  unitsSymbol,
  initValue,
  minValue,
  maxValue,
) {
  this.w = zoom.w;
  this.parentEl = parentEl;
  this.minValue = minValue;
  this.maxValue = maxValue;
  this.onChangeFn = onChangeFn;

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
          txtValue: StaticText {}, \
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
  var mouseDownPosition;

  var g = txtUnits.graphics;
  var lightPen = g.newPen(g.PenType.SOLID_COLOR, [0.75, 0.75, 0.75, 1], 1);
  var darkPen = g.newPen(g.PenType.SOLID_COLOR, [0.55, 0.55, 0.55, 1], 1);
  var bluePen = g.newPen(g.PenType.SOLID_COLOR, BLUE_COLOR, 2);

  if (initValue !== undefined && !isNaN(parseFloat(initValue))) {
    txtValue.text = parseFloat(initValue);
  }

  txtValue.graphics.foregroundColor = bluePen;
  this.element.minimumSize = this.element.graphics.measureString("00000000");

  grValue.addEventListener("mousedown", function (event) {
    if (event.eventPhase === "target") {
      isMouseDown = true;
      mouseDownPosition = [event.screenX, event.screenY];
    }
  });

  grValue.addEventListener("mouseup", function (event) {
    if (event.eventPhase === "target" && isMouseDown) {
      isMouseDown = false;

      var editText = thisNumberValue.element.add(
        "EditText { \
          active: true, \
          alignment: 'left', \
          text: '" +
          txtValue.text +
          "', \
        }",
      );

      editText.size = [
        editText.graphics.measureString("000000")[0],
        thisNumberValue.element.size[1],
      ];

      editText.onChange = function () {
        var newValue = parseFloat(this.text);

        if (!isNaN(newValue) && typeof onChangeFn === "function") {
          onChangeFn(newValue);
        }
      };

      editText.addEventListener("blur", function (event) {
        if (event.eventPhase === "target") {
          var newValue = parseFloat(this.text);

          if (!isNaN(newValue)) {
            thisNumberValue.setValue(newValue);
            thisNumberValue.onChange();
          }

          thisNumberValue.element.remove(this);
          grValue.show();
        }
      });

      editText.addEventListener("keydown", function (event) {
        if (event.eventPhase === "target") {
          if (event.keyName === "Up") {
            event.preventDefault();
            var val = parseFloat(this.text);

            if (!isNaN(val)) {
              this.text = val + 1;
            }
          } else if (event.keyName === "Down") {
            event.preventDefault();
            val = parseFloat(this.text);

            if (!isNaN(val)) {
              this.text = val - 1;
            }
          }
        }
      });

      grValue.hide();
      this.parent.layout.layout(true);
    }
  });

  grValue.addEventListener("mousemove", function (event) {
    if (
      event.eventPhase === "target" &&
      isMouseDown &&
      Math.abs(event.screenX - mouseDownPosition[0]) >= 3
    ) {
      if (typeof onScrubStartFn === "function") {
        onScrubStartFn();
      }

      var ctrlKey = false;
      var shiftKey = false;
      var primaryScreen;

      for (var i = 0; i < $.screens.length; i++) {
        if ($.screens[i].primary) {
          primaryScreen = $.screens[i];
        }
      }

      grUnderline.show();

      var screenWin = new Window(
        "palette { \
        alignChildren: ['fill','fill'], \
        margins: 0, \
        opacity: 0.01, \
        properties: { borderless: true } \
      }",
      );

      screenWin.preferredSize = [primaryScreen.right, primaryScreen.bottom];

      screenWin.closeWindow = function () {
        if (screenWin.visible) {
          screenWin.close();
          grUnderline.hide();

          if (typeof onScrubEndFn === "function") {
            onScrubEndFn();
          }
        }
      };

      var screenGr = screenWin.add("group");
      screenGr.lastMousePosition = mouseDownPosition;

      screenGr.addEventListener("mousemove", function (event) {
        if (event.eventPhase === "target") {
          var mouseDistance = Math.floor(
            event.screenX - this.lastMousePosition[0],
          );

          ctrlKey = checkOs() === OS.WIN ? event.ctrlKey : event.metaKey;
          shiftKey = event.shiftKey;

          if (Math.abs(mouseDistance) >= 1) {
            if (shiftKey) {
              mouseDistance *= 10;
            } else if (ctrlKey) {
              mouseDistance /= 10;
            }

            var newValue = thisNumberValue.getValue() + mouseDistance;

            if (!ctrlKey) {
              newValue = makeDivisibleBy(newValue, 1, mouseDistance < 0);
            }

            if (shiftKey) {
              newValue = makeDivisibleBy(newValue, 10, mouseDistance < 0);
            }

            thisNumberValue.setValue(newValue);
            thisNumberValue.onChange();
            this.lastMousePosition = [event.screenX, event.screenY];
          }
        }
      });

      screenGr.addEventListener("mouseout", function (event) {
        if (event.eventPhase === "target") {
          screenWin.closeWindow();
        }
      });

      screenGr.addEventListener("mouseup", function (event) {
        if (event.eventPhase === "target") {
          screenWin.closeWindow();
        }
      });

      screenWin.show();

      isMouseDown = false;
    }
  });

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
