import bind from "../../../extern/function-bind";
import preferences from "../../preferences";
import NumberValue from "../number-value";

function GeneralSettings(parentEl, zoom) {
  this.element = parentEl.add(
    "tab { \
      text: 'General', \
      alignChildren: ['left', 'top'], \
      orientation: 'row', \
      gr: Group { \
        orientation: 'column', \
        alignChildren: ['fill', 'top'], \
        pnlSync: Panel { \
          alignChildren: 'left', \
          grCheck1: Group { \
            spacing: 2, \
            chk: Checkbox { preferredSize: [-1, 14] }, \
            txt: StaticText { text: 'Sync zoom value with viewport' }, \
          }, \
          txtDescription: StaticText { \
            text: 'Synchronize zoom value in the script with the actual value in the active viewport when hovering over the panel with mouse cursor.', \
            characters: 55, \
            properties: { multiline: true }, \
          },\
        }, \
        pnlSlider: Panel { \
          text: 'Slider', \
          alignChildren: 'left', \
          grCheck1: Group { \
            spacing: 2, \
            chk: Checkbox { preferredSize: [-1, 14] }, \
            txt: StaticText { text: 'Show Slider' }, \
          }, \
          grMinValue: Group { \
            spacing: 0, \
            txt: StaticText { text: 'Min Value: ' }, \
          }, \
          grMaxValue: Group { \
            spacing: 0, \
            txt: StaticText { text: 'Max Value: ' }, \
          }, \
        }, \
      }, \
    }",
  );

  var pnlSlider = this.element.gr.pnlSlider;

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
}

export default GeneralSettings;
