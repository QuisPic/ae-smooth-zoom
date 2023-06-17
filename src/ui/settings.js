import MenuWindow from "./menu-window";
import NumberValue from "./number-value";
import Slider from "./slider";
import { DEFAULT_SETTINGS, SETTINGS_SECTION_NAME } from "../constants";
import { openURL } from "../utils";

function Settings(zoom, parentEl) {
  this.element = parentEl.add(
    "Group { \
      alignChildren: ['center', 'center'], \
      margins: [5, 0, 5, 0], \
      grDots: Group { preferredSize: [4, 20] }, \
    }",
  );

  this.element.grDots.onDraw = function () {
    var g = this.graphics;
    var b = g.newBrush(g.BrushType.SOLID_COLOR, [0.57, 0.57, 0.57, 1]);

    g.ellipsePath(0, 4, 2, 2);
    g.fillPath(b);

    g.ellipsePath(0, 9, 2, 2);
    g.fillPath(b);

    g.ellipsePath(0, 14, 2, 2);
    g.fillPath(b);
  };

  this.element.addEventListener("click", function (event) {
    function setZoomTo(zoomValue) {
      zoom.setTo(zoomValue);
    }

    if (event.eventPhase === "target") {
      var zoomSettings = Settings.getSettings();
      var menuWindow = new MenuWindow();
      var maxTextSize =
        menuWindow.element.graphics.measureString("Show Slider");

      var onScrubStartFn = function () {
        menuWindow.element.shouldCloseOnDeactivate = false;
      };
      var onScrubEndFn = function () {
        menuWindow.element.shouldCloseOnDeactivate = true;

        // make the window active
        menuWindow.element.hide();
        menuWindow.element.show();
      };

      // we pass this empty function because there is a strage bug
      // in AE where if a window doesn't have a reference to a function
      // it will close immediately
      var showSliderItem = menuWindow.addMenuItem(
        "Show Slider",
        function () {},
      );

      var grCheckShowSlider = showSliderItem.add(
        "Group { \
          margins: [6, 0, 0, 0], \
          check: Checkbox { \
            alignment: ['left', 'bottom'], \
            preferredSize: [-1, 14], \
          }, \
        }",
      );

      grCheckShowSlider.check.value = zoomSettings.showSlider;
      grCheckShowSlider.check.onClick = function () {
        var zoomSettings = Settings.getSettings();

        if (zoom.zoomSlider && isValid(zoom.zoomSlider.element)) {
          zoom.zoomSlider.parentEl.remove(zoom.zoomSlider.element);
          zoom.zoomSlider.parentEl.preferredSize = [0, 0];

          zoom.w.grSlider.alignment = ["left", "center"];
          zoom.settings.element.alignment = ["left", "center"];

          this.value = false;
        } else {
          zoom.zoomSlider = new Slider(
            zoom,
            zoom.w.grSlider,
            setZoomTo,
            zoom.zoomNumberValue.getValue(),
            zoomSettings.sliderMin,
            zoomSettings.sliderMax,
          );

          zoom.w.grSlider.alignment = ["fill", "center"];
          zoom.settings.element.alignment = ["right", "center"];

          this.value = true;
        }

        app.settings.saveSetting(
          SETTINGS_SECTION_NAME,
          "showSlider",
          this.value,
        );

        zoom.w.layout.layout(true);
        zoom.w.layout.resize();
      };

      showSliderItem.addEventListener("click", function (event) {
        if (event.eventPhase === "target") {
          grCheckShowSlider.check.notify();
        }
      });

      var sliderMinItem = menuWindow.addMenuItem("Slider Min");
      var sliderMaxItem = menuWindow.addMenuItem("Slider Max");

      var sliderMinValue = new NumberValue(
        zoom,
        sliderMinItem,
        undefined,
        onScrubStartFn,
        onScrubEndFn,
        "%",
        zoomSettings.sliderMin,
        0,
        zoomSettings.sliderMax,
      );

      var sliderMaxValue = new NumberValue(
        zoom,
        sliderMaxItem,
        undefined,
        onScrubStartFn,
        onScrubEndFn,
        "%",
        zoomSettings.sliderMax,
        zoomSettings.sliderMin,
      );

      sliderMinValue.onChangeFn = function (val) {
        app.settings.saveSetting(SETTINGS_SECTION_NAME, "sliderMin", val);
        sliderMaxValue.minValue = val;

        if (zoom.zoomSlider && isValid(zoom.zoomSlider.element)) {
          zoom.zoomSlider.setMin(val);
        }
      };

      sliderMaxValue.onChangeFn = function (val) {
        app.settings.saveSetting(SETTINGS_SECTION_NAME, "sliderMax", val);
        sliderMinValue.maxValue = val;

        if (zoom.zoomSlider && isValid(zoom.zoomSlider.element)) {
          zoom.zoomSlider.setMax(val);
        }
      };

      showSliderItem.txtValue.preferredSize = maxTextSize;
      sliderMinItem.txtValue.preferredSize = maxTextSize;
      sliderMaxItem.txtValue.preferredSize = maxTextSize;

      menuWindow.addDivider();
      menuWindow.addMenuItem("Author", function () {
        openURL("https://twitter.com/quismotion");
      });
      menuWindow.addMenuItem("Github", function () {
        openURL("https://github.com/QuisPic/ae-smooth-zoom");
      });

      menuWindow.element.opacity = 0;
      menuWindow.element.show();
      menuWindow.stickTo(this, false, event, this.grDots);
      menuWindow.element.opacity = 1;
    }
  });
}

Settings.getSettings = function () {
  var result = {};

  if (app.settings.haveSetting(SETTINGS_SECTION_NAME, "showSlider")) {
    result.showSlider =
      app.settings.getSetting(SETTINGS_SECTION_NAME, "showSlider") === "true";
  } else {
    result.showSlider = DEFAULT_SETTINGS.showSlider;
  }

  if (app.settings.haveSetting(SETTINGS_SECTION_NAME, "sliderMin")) {
    result.sliderMin = parseInt(
      app.settings.getSetting(SETTINGS_SECTION_NAME, "sliderMin"),
    );
  } else {
    result.sliderMin = DEFAULT_SETTINGS.sliderMin;
  }

  if (app.settings.haveSetting(SETTINGS_SECTION_NAME, "sliderMax")) {
    result.sliderMax = parseInt(
      app.settings.getSetting(SETTINGS_SECTION_NAME, "sliderMax"),
    );
  } else {
    result.sliderMax = DEFAULT_SETTINGS.sliderMax;
  }

  return result;
};

export default Settings;
