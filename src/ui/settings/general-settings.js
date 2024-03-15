import bind from "../../../extern/function-bind";
import preferences from "../../preferences";
import NumberValue from "../number-value";
import Checkbox from "../checkbox";
import ValuesList from "./list/values-list";
import JSON from "../../../extern/json2";

function GeneralSettings(parentEl, zoom) {
  this.zoom = zoom;

  this.element = parentEl.add(
    "tab { \
      text: 'General', \
      alignChildren: ['fill', 'top'], \
      orientation: 'row', \
      margins: [12, 10, 0, 10], \
      gr: Group { \
        orientation: 'column', \
        alignChildren: ['fill', 'top'], \
        pnlSync: Panel { \
          alignChildren: 'left', \
          grCheck: Group {}, \
          txtDescription: StaticText { \
            text: 'Synchronize zoom value in the script with the actual value in the active viewport when hovering over the panel with mouse cursor.', \
            characters: 55, \
            properties: { multiline: true }, \
          },\
        }, \
        pnlHighDPI: Panel { \
          alignChildren: 'left', \
          grCheck: Group {}, \
          grScale: Group { \
            spacing: 0, \
            txt: StaticText { text: 'Scale Factor: ' }, \
          }, \
          txtDescription: StaticText { \
            text: 'Enabling this option fixes the problem where the actual zoom change is more than what is set in the UI panel on high DPI displays.', \
            characters: 55, \
            properties: { multiline: true }, \
          },\
        }, \
        pnlSlider: Panel { \
          text: 'Slider', \
          alignChildren: 'left', \
          grCheck: Group {}, \
          grMinMax: Group { \
            orientation: 'column', \
            spacing: 2, \
            grMinValue: Group { \
              spacing: 0, \
              txt: StaticText { text: 'Slider Min: ' }, \
            }, \
            grMaxValue: Group { \
              spacing: 0, \
              txt: StaticText { text: 'Slider Max: ' }, \
            }, \
          }, \
        }, \
        pnlPresetList: Panel { \
          text: 'Preset Values', \
          alignChildren: ['fill', 'top'], \
        }, \
      }, \
    }",
  );

  this.settingsOnStart = {
    syncWithView: preferences.syncWithView,
    highDPI: preferences.highDPI,
    showSlider: preferences.showSlider,
    sliderMin: preferences.sliderMin,
    sliderMax: preferences.sliderMax,
    presetValues: preferences.presetValues,
  };

  var pnlSync = this.element.gr.pnlSync;
  var pnlHighDPI = this.element.gr.pnlHighDPI;
  var pnlSlider = this.element.gr.pnlSlider;
  var grMinMax = pnlSlider.grMinMax;

  var saveHighDpiPrefs = function () {
    preferences.save("highDPI", {
      enabled: pnlHighDPI.grCheck.element.check.value,
      scale: pnlHighDPI.grScale.numValue.getValue(),
    });
  };

  pnlSync.grCheck = new Checkbox(
    pnlSync,
    "Sync zoom value with viewport",
    pnlSync.grCheck,
  );

  pnlSync.grCheck.setValue(preferences.syncWithView);
  pnlSync.grCheck.setOnClick(function () {
    preferences.save("syncWithView", this.value);
  });

  pnlHighDPI.grCheck = new Checkbox(
    pnlHighDPI,
    "High DPI display support",
    pnlHighDPI.grCheck,
  );

  pnlHighDPI.grCheck.setValue(preferences.highDPI.enabled);
  pnlHighDPI.grCheck.setOnClick(function () {
    pnlHighDPI.grScale.enabled = this.value;
    saveHighDpiPrefs();
  });

  pnlHighDPI.grScale.numValue = new NumberValue(
    pnlHighDPI.grScale,
    "x",
    preferences.highDPI.scale,
    0,
    undefined,
    undefined,
    undefined,
    saveHighDpiPrefs,
    "Difference between UI and actual values",
  );
  pnlHighDPI.grScale.enabled = preferences.highDPI.enabled;

  pnlSlider.grCheck = new Checkbox(pnlSlider, "Show Slider", pnlSlider.grCheck);
  pnlSlider.grCheck.setValue(preferences.showSlider);
  pnlSlider.grCheck.setOnClick(function () {
    zoom.showHideSlider(this.value);
  });

  grMinMax.grMinValue.numValue = new NumberValue(
    grMinMax.grMinValue,
    "%",
    preferences.sliderMin,
    0,
    preferences.sliderMax,
  );

  grMinMax.grMaxValue.numValue = new NumberValue(
    grMinMax.grMaxValue,
    "%",
    preferences.sliderMax,
    preferences.sliderMin,
  );

  grMinMax.grMinValue.numValue.onChangeFn = bind(function (val) {
    preferences.save("sliderMin", val);
    grMinMax.grMaxValue.numValue.minValue = val;

    if (zoom.zoomSlider && isValid(zoom.zoomSlider.element)) {
      zoom.zoomSlider.setMin(val);
    }
  }, this);

  grMinMax.grMaxValue.numValue.onChangeFn = bind(function (val) {
    preferences.save("sliderMax", val);
    grMinMax.grMinValue.numValue.maxValue = val;

    if (zoom.zoomSlider && isValid(zoom.zoomSlider.element)) {
      zoom.zoomSlider.setMax(val);
    }
  }, this);

  var maxTextSize = pnlSlider.graphics.measureString(
    grMinMax.grMaxValue.txt.text,
  );
  grMinMax.grMinValue.txt.preferredSize = maxTextSize;
  grMinMax.grMaxValue.txt.preferredSize = maxTextSize;

  this.element.gr.pnlPresetList.list = new ValuesList(
    this.element.gr.pnlPresetList,
  );
}

GeneralSettings.prototype.cancel = function () {
  var pnlSlider = this.element.gr.pnlSlider;

  preferences.save("syncWithView", this.settingsOnStart.syncWithView);
  preferences.save("highDPI", this.settingsOnStart.highDPI);
  this.zoom.showHideSlider(this.settingsOnStart.showSlider);
  pnlSlider.grMinMax.grMinValue.numValue.onChangeFn(
    this.settingsOnStart.sliderMin,
  );
  pnlSlider.grMinMax.grMaxValue.numValue.onChangeFn(
    this.settingsOnStart.sliderMax,
  );
  preferences.save("presetValues", this.settingsOnStart.presetValues);
};

export default GeneralSettings;
