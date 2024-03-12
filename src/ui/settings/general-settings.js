import bind from "../../../extern/function-bind";
import preferences from "../../preferences";
import NumberValue from "../number-value";
import Checkbox from "../checkbox";
import ValuesList from "./list/values-list";

function GeneralSettings(parentEl, zoom) {
  this.zoom = zoom;

  this.element = parentEl.add(
    "tab { \
      text: 'General', \
      alignChildren: ['left', 'top'], \
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
        pnlSlider: Panel { \
          text: 'Slider', \
          alignChildren: 'left', \
          grCheck: Group {}, \
          grMinValue: Group { \
            spacing: 0, \
            txt: StaticText { text: 'Slider Min: ' }, \
          }, \
          grMaxValue: Group { \
            spacing: 0, \
            txt: StaticText { text: 'Slider Max: ' }, \
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
    showSlider: preferences.showSlider,
    sliderMin: preferences.sliderMin,
    sliderMax: preferences.sliderMax,
    presetValues: preferences.presetValues,
  };

  var pnlSync = this.element.gr.pnlSync;
  var pnlSlider = this.element.gr.pnlSlider;

  pnlSync.grCheck = new Checkbox(
    pnlSync,
    "Sync zoom value with viewport",
    pnlSync.grCheck,
  );

  pnlSync.grCheck.setValue(preferences.syncWithView);
  pnlSync.grCheck.setOnClick(function () {
    preferences.save("syncWithView", this.value);
  });

  pnlSlider.grCheck = new Checkbox(pnlSlider, "Show Slider", pnlSlider.grCheck);
  pnlSlider.grCheck.setValue(preferences.showSlider);
  pnlSlider.grCheck.setOnClick(function () {
    zoom.showHideSlider(this.value);
  });

  pnlSlider.grMinValue.numValue = new NumberValue(
    pnlSlider.grMinValue,
    "%",
    preferences.sliderMin || 1,
    1,
    preferences.sliderMax,
  );

  pnlSlider.grMaxValue.numValue = new NumberValue(
    pnlSlider.grMaxValue,
    "%",
    preferences.sliderMax,
    preferences.sliderMin || 1,
  );

  pnlSlider.grMinValue.numValue.onChangeFn = bind(function (val) {
    preferences.save("sliderMin", val);
    pnlSlider.grMaxValue.numValue.minValue = val;

    if (zoom.zoomSlider && isValid(zoom.zoomSlider.element)) {
      zoom.zoomSlider.setMin(val);
    }
  }, this);

  pnlSlider.grMaxValue.numValue.onChangeFn = bind(function (val) {
    preferences.save("sliderMax", val);
    pnlSlider.grMinValue.numValue.maxValue = val;

    if (zoom.zoomSlider && isValid(zoom.zoomSlider.element)) {
      zoom.zoomSlider.setMax(val);
    }
  }, this);

  var maxTextSize = pnlSlider.graphics.measureString(
    pnlSlider.grMaxValue.txt.text,
  );
  pnlSlider.grMinValue.txt.preferredSize = maxTextSize;
  pnlSlider.grMaxValue.txt.preferredSize = maxTextSize;

  this.element.gr.pnlPresetList.list = new ValuesList(
    this.element.gr.pnlPresetList,
  );
}

GeneralSettings.prototype.cancel = function () {
  var pnlSlider = this.element.gr.pnlSlider;

  preferences.save("syncWithView", this.settingsOnStart.syncWithView);
  this.zoom.showHideSlider(this.settingsOnStart.showSlider);
  pnlSlider.grMinValue.numValue.onChangeFn(this.settingsOnStart.sliderMin);
  pnlSlider.grMaxValue.numValue.onChangeFn(this.settingsOnStart.sliderMax);
  preferences.save("presetValues", this.settingsOnStart.presetValues);
};

export default GeneralSettings;
