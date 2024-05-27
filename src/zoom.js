import Settings from "./ui/settings";
import NumberValue from "./ui/number-value";
import Slider from "./ui/slider";
import ValueList from "./ui/value-list";
import { KB_ACTION, STICK_TO } from "./constants";
import preferences from "./preferences";
import bind from "../extern/function-bind";
import zoomPlugin from "./zoomPlugin";

function Zoom(thisObj) {
  var currentZoom = this.getViewZoom() || 100;

  this.w =
    thisObj instanceof Panel
      ? thisObj
      : new Window("palette", "Zoom", undefined, { resizeable: true });

  this.w.orientation = "row";
  this.w.alignChildren = ["left", "center"];
  this.w.spacing = 2;
  this.w.margins = this.w instanceof Panel ? [2, 0, 2, 0] : [5, 5, 8, 5];

  this.w.onResize = function () {
    this.layout.resize();
  };

  this.w.onResizing = this.w.onResize;

  this.zoomNumberValue = new NumberValue(
    this.w,
    "%",
    currentZoom,
    1,
    undefined,
    this.produceSetTo(),
  );

  this.zoomNumberValue.element.addEventListener(
    "mouseover",
    this.produceSyncOnMouseOver(),
  );

  this.zoomValueList = new ValueList(
    this.w,
    bind(function (val) {
      this.setTo(val);
      this.setUiTo(val);
    }, this),
    this.zoomNumberValue.element,
    STICK_TO.LEFT,
  );
  this.w.grSlider = this.w.add("group");
  this.settings = new Settings(this, this.w);

  if (preferences.showSlider) {
    this.addSlider();
  }
}

Zoom.prototype.getActiveViewer = function () {
  if (app.activeViewer) {
    this.lastActiveViewer = app.activeViewer;
    return app.activeViewer;
  } else if (this.lastActiveViewer) {
    return this.lastActiveViewer;
  } else {
    return;
  }
};

Zoom.prototype.addSlider = function () {
  this.zoomSlider = new Slider(
    this,
    this.w.grSlider,
    this.produceSliderOnChange(),
    this.produceSliderOnScrubStart(),
    this.produceSliderOnScrubEnd(),
    this.zoomNumberValue.getValue(),
    preferences.sliderMin || 1,
    preferences.sliderMax,
  );

  this.zoomSlider.element.addEventListener(
    "mouseover",
    this.produceSyncOnMouseOver(),
  );

  this.zoomSlider.addIncrementBtns(this, this.produceOnIncrement());

  this.w.grSlider.alignment = ["fill", "center"];
  this.settings.element.alignment = ["right", "center"];
};

Zoom.prototype.getViewZoom = function () {
  var viewer = this.getActiveViewer();

  if (!viewer) {
    return undefined;
  }

  var zoomValue = viewer.views[0].options.zoom;
  zoomValue *= preferences.highDPI.enabled
    ? 100 * preferences.highDPI.scale
    : 100;

  return parseFloat(zoomValue.toFixed(2));
};

Zoom.prototype.setUiTo = function (zoomValue) {
  this.zoomNumberValue.setValue(zoomValue);

  if (this.zoomSlider && isValid(this.zoomSlider.element)) {
    this.zoomSlider.setValue(zoomValue);
  }
};

Zoom.prototype.setTo = function (zoomValue) {
  zoomValue = zoomValue < 0.8 ? 0.8 : zoomValue;
  var viewer = this.getActiveViewer();
  var isActionPosted = false;

  if (
    preferences.experimental.fixViewportPosition.enabled &&
    zoomPlugin.isAvailable()
  ) {
    isActionPosted = zoomPlugin.postZoomAction(KB_ACTION.SET_TO, zoomValue);
  }

  if (!isActionPosted && viewer) {
    zoomValue /= preferences.highDPI.enabled
      ? 100 * preferences.highDPI.scale
      : 100;
    viewer.views[0].options.zoom = zoomValue;
  }
};

Zoom.prototype.syncWithView = function () {
  var viewZoomValue = this.getViewZoom();

  if (
    viewZoomValue !== undefined &&
    viewZoomValue !== this.zoomNumberValue.getValue()
  ) {
    this.setUiTo(viewZoomValue);
  }
};

// function factory for passing the func to other functions
Zoom.prototype.produceSetTo = function () {
  var thisZoom = this;

  return function (zoomValue) {
    thisZoom.setTo(zoomValue);
  };
};

Zoom.prototype.produceSyncOnMouseOver = function () {
  var thisZoom = this;

  return function (event) {
    if (event.eventPhase === "target" && preferences.syncWithView) {
      thisZoom.syncWithView();
    }
  };
};

Zoom.prototype.produceSliderOnScrubStart = function () {
  var thisZoom = this;

  return function () {
    var viewer = thisZoom.getActiveViewer();

    thisZoom.origExposure = viewer ? viewer.views[0].options.exposure : 0;
  };
};

Zoom.prototype.produceSliderOnChange = function () {
  var thisZoom = this;

  return function (zoomValue) {
    var viewer = thisZoom.getActiveViewer();
    var view = viewer ? viewer.views[0] : undefined;

    thisZoom.setTo(zoomValue);
    thisZoom.setUiTo(zoomValue);

    // this exposure trick makes AE refresh the view panel everytime we move the slider
    if (thisZoom.origExposure !== undefined && viewer) {
      view.options.exposure =
        view.options.exposure === thisZoom.origExposure
          ? thisZoom.origExposure + 0.01
          : thisZoom.origExposure;
    }
  };
};

Zoom.prototype.produceSliderOnScrubEnd = function () {
  var thisZoom = this;

  return function () {
    var viewer = thisZoom.getActiveViewer();
    var view = viewer ? viewer.views[0] : undefined;

    if (thisZoom.origExposure !== undefined && view) {
      view.options.exposure = thisZoom.origExposure;
    }

    thisZoom.origExposure = undefined;
  };
};

Zoom.prototype.produceOnIncrement = function () {
  var thisZoom = this;

  return function (zoomValue) {
    var currValue = thisZoom.zoomNumberValue.getValue();
    var viewValue = thisZoom.getViewZoom() || currValue;

    if (preferences.syncWithView && currValue !== viewValue) {
      zoomValue = viewValue + (zoomValue - currValue);
    }

    thisZoom.setTo(zoomValue);
    thisZoom.setUiTo(zoomValue);
  };
};

Zoom.prototype.showHideSlider = function (val) {
  val = val === undefined ? !preferences.showSlider : val;
  var hasSlider = this.zoomSlider && isValid(this.zoomSlider.element);

  if (val && !hasSlider) {
    this.addSlider();
  } else if (!val && hasSlider) {
    this.zoomSlider.parentEl.remove(this.zoomSlider.element);
    this.zoomSlider.parentEl.preferredSize = [0, 0];

    this.w.grSlider.alignment = ["left", "center"];
    this.settings.element.alignment = ["left", "center"];
  }

  preferences.save("showSlider", val);

  this.w.layout.layout(true);
  this.w.layout.resize();
};

export default Zoom;
