import { checkOs, makeDivisibleBy } from "../utils";
import { OS, ZOOM_STEP_ON_BTN_CLICK } from "../constants";

function Slider(
  zoom,
  parentEl,
  onChangeFn,
  onScrubStartFn,
  onScrubEndFn,
  initVal,
  min,
  max,
) {
  this.parentEl = parentEl;

  this.element = parentEl.add(
    "Group { \
      spacing: 1, \
      alignment: ['fill', 'center'], \
      grDecrement: Group { \
        orientation: 'stack', \
        alignment: ['left', 'center'], \
        alignChildren: ['fill', 'fill'], \
      }, \
      slider: Slider { \
        preferredSize: [150, -1], \
        alignment: ['fill', 'center'], \
      }, \
      grIncrement: Group { \
        orientation: 'stack', \
        alignment: ['right', 'center'], \
        alignChildren: ['fill', 'fill'], \
      }, \
    }",
  );

  this.setMin(min);
  this.setMax(max);
  this.setValue(initVal);
  this.lastValue = initVal;

  var slider = this.element.slider;

  slider.onChange = function () {
    if (typeof onScrubEndFn === "function") {
      onScrubEndFn();
    }

    this.scrubbing = false;
  };

  slider.onChanging = function () {
    if (!this.scrubbing) {
      if (typeof onScrubStartFn === "function") {
        onScrubStartFn();
      }

      this.scrubbing = true;
    }

    if (typeof onChangeFn === "function" && this.scrubbing) {
      onChangeFn(Math.round(this.value));
    }
  };
}

Slider.prototype.addIncrementBtns = function (zoom, onIncrementFn) {
  var grIncrement = this.element.grIncrement;
  var grDecrement = this.element.grDecrement;

  grDecrement.zoomIcon = grDecrement.add("Group { preferredSize: [25, 16] }");
  grDecrement.grLight = grDecrement.add("Group { visible: false }");

  grIncrement.zoomIcon = grIncrement.add("Group { preferredSize: [25, 16] }");
  grIncrement.grLight = grIncrement.add("Group { visible: false }");

  var g = grDecrement.grLight.graphics;
  var lightBrush = g.newBrush(g.BrushType.SOLID_COLOR, [1, 1, 1, 0.06]);

  function increment(zoomStep, mouseEvent) {
    if (checkOs() === OS.WIN ? mouseEvent.ctrlKey : mouseEvent.metaKey) {
      zoomStep /= 10;
    } else if (mouseEvent.shiftKey) {
      zoomStep *= 10;
    }

    var newValue = makeDivisibleBy(
      zoom.zoomNumberValue.getValue() + zoomStep,
      zoomStep,
      zoomStep < 0,
    );

    // this.element.slider.value = newValue;
    zoom.zoomSlider.setValue(newValue);

    if (typeof onIncrementFn === "function") {
      onIncrementFn(newValue);
    }
  }

  function showLight(event) {
    if (event.eventPhase === "target") {
      this.zoomIcon.light = true;
      this.grLight.show();
    }
  }

  function hideLight(event) {
    if (event.eventPhase === "target") {
      this.zoomIcon.light = false;
      this.grLight.hide();
    }
  }

  grDecrement.grLight.graphics.backgroundColor = lightBrush;
  grIncrement.grLight.graphics.backgroundColor = lightBrush;

  grIncrement.zoomIcon.onDraw = function () {
    var g = this.graphics;
    var c = this.light ? [0.9, 0.9, 0.9, 1] : [0.65, 0.65, 0.65, 1];
    var b = g.newBrush(g.BrushType.SOLID_COLOR, c);

    g.moveTo(3, this.size[1] - 4);
    g.lineTo(g.currentPoint[0] + 6, g.currentPoint[1] - 6);
    g.lineTo(g.currentPoint[0] + 2, g.currentPoint[1] + 2);
    g.lineTo(g.currentPoint[0] - 4, g.currentPoint[1] + 4);
    g.fillPath(b);

    var lastPoint = g.currentPoint;
    g.currentPath = g.newPath();
    g.moveTo(lastPoint[0] + 1, lastPoint[1]);
    g.lineTo(g.currentPoint[0] + 7, g.currentPoint[1] - 8);
    g.lineTo(g.currentPoint[0] + 7, g.currentPoint[1] + 8);
    g.fillPath(b);
  };

  grDecrement.zoomIcon.onDraw = function () {
    var g = this.graphics;
    var c = this.light ? [0.9, 0.9, 0.9, 1] : [0.65, 0.65, 0.65, 1];
    var b = g.newBrush(g.BrushType.SOLID_COLOR, c);

    g.moveTo(8, this.size[1] - 5);
    g.lineTo(g.currentPoint[0] + 3, g.currentPoint[1] - 3);
    g.lineTo(g.currentPoint[0] + 1, g.currentPoint[1] + 1);
    g.lineTo(g.currentPoint[0] - 2, g.currentPoint[1] + 2);
    g.fillPath(b);

    var lastPoint = g.currentPoint;
    g.currentPath = g.newPath();
    g.moveTo(lastPoint[0], lastPoint[1]);
    g.lineTo(g.currentPoint[0] + 4, g.currentPoint[1] - 4);
    g.lineTo(g.currentPoint[0] + 4, g.currentPoint[1] + 4);
    g.fillPath(b);
  };

  grIncrement.addEventListener("click", function (event) {
    if (event.eventPhase === "target") {
      increment(ZOOM_STEP_ON_BTN_CLICK, event);
    }
  });

  grDecrement.addEventListener("click", function (event) {
    if (event.eventPhase === "target") {
      increment(-ZOOM_STEP_ON_BTN_CLICK, event);
    }
  });

  grDecrement.addEventListener("mouseover", showLight);
  grIncrement.addEventListener("mouseover", showLight);
  grDecrement.addEventListener("mouseout", hideLight);
  grIncrement.addEventListener("mouseout", hideLight);
};

Slider.prototype.getValue = function () {
  return Math.round(this.element.slider.value);
};

Slider.prototype.setValue = function (val) {
  this.element.slider.value = val;
  this.lastValue = this.element.slider.value;
};

Slider.prototype.getMin = function () {
  return this.element.slider.minvalue;
};

Slider.prototype.getMax = function () {
  return this.element.slider.maxvalue;
};

Slider.prototype.setMin = function (min) {
  this.element.slider.minvalue = min;
};

Slider.prototype.setMax = function (max) {
  this.element.slider.maxvalue = max;
};

export default Slider;
