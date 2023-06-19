import Settings from "./ui/settings";
import NumberValue from "./ui/number-value";
import Slider from "./ui/slider";
import ValueList from "./ui/value-list";

function Zoom(thisObj) {
  var currentZoom = app.activeViewer.views[0].options.zoom * 100;
  var zoomSettings = Settings.getSettings();

  this.w =
    thisObj instanceof Panel
      ? thisObj
      : new Window("palette", "Zoom", undefined, { resizeable: true });

  this.w.orientation = "row";
  this.w.alignChildren = ["left", "center"];
  this.w.spacing = 2;
  this.w.margins = this.w instanceof Panel ? [2, 0, 2, 0] : 5;

  this.w.onResize = function () {
    this.layout.resize();
  };

  this.w.onResizing = this.w.onResize;

  var thisZoom = this;
  function setZoomTo(zoomValue) {
    thisZoom.setTo(zoomValue);
  }

  this.zoomNumberValue = new NumberValue(
    this,
    this.w,
    setZoomTo,
    undefined,
    undefined,
    "%",
    currentZoom,
    0,
  );

  this.zoomValueList = new ValueList(this, this.w, setZoomTo);
  this.w.grSlider = this.w.add("group");
  this.settings = new Settings(this, this.w);

  if (zoomSettings.showSlider) {
    this.zoomSlider = new Slider(
      this,
      this.w.grSlider,
      setZoomTo,
      currentZoom,
      zoomSettings.sliderMin,
      zoomSettings.sliderMax,
    );

    this.w.grSlider.alignment = ["fill", "center"];
    this.settings.element.alignment = ["right", "center"];
  }
}

Zoom.prototype.setTo = function (zoomValue) {
  zoomValue = zoomValue < 0 ? 0 : zoomValue;

  this.zoomNumberValue.setValue(zoomValue);

  if (this.zoomSlider && isValid(this.zoomSlider.element)) {
    this.zoomSlider.setValue(zoomValue);
  }

  app.activeViewer.views[0].options.zoom = zoomValue / 100;
};

export default Zoom;
