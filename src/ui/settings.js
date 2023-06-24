import MenuWindow from "./menu-window";
import NumberValue from "./number-value";
import { DEFAULT_SETTINGS, OS, SETTINGS_SECTION_NAME } from "../constants";
import { checkOs, openURL } from "../utils";
import Checkbox from "./checkbox";

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
    if (event.eventPhase === "target") {
      var zoomSettings = Settings.getSettings();
      var menuWindow = new MenuWindow();
      var maxTextSize =
        menuWindow.element.graphics.measureString("Sync with View");

      var onScrubStartFn = function () {
        menuWindow.element.shouldCloseOnDeactivate = false;
      };
      var onScrubEndFn = function () {
        menuWindow.element.shouldCloseOnDeactivate = true;

        if (checkOs() === OS.WIN) {
          // make the window active
          menuWindow.element.hide();
          menuWindow.element.show();
        }
      };

      // we pass this empty function because there is a strage bug
      // in AE where if a window doesn't have a reference to a function
      // it will close immediately
      var syncItem = menuWindow.addMenuItem("Sync with View", function () {});

      // "Sync With Viewport" checkbox
      var syncCheck = new Checkbox(
        zoom,
        syncItem,
        zoomSettings.syncWithView,
        function () {
          app.settings.saveSetting(
            SETTINGS_SECTION_NAME,
            "syncWithView",
            this.value,
          );
        },
      );

      syncCheck.element.check.helpTip =
        "If ON, the script will sync its value with the viewport when you hover over it.";

      var showSliderItem = menuWindow.addMenuItem(
        "Show Slider",
        function () {},
      );

      // "Show Slider" checkbox
      new Checkbox(zoom, showSliderItem, zoomSettings.showSlider, function () {
        zoom.showHideSlider();
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
        zoomSettings.sliderMin || 1,
        1,
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
        zoomSettings.sliderMin || 1,
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

  if (app.settings.haveSetting(SETTINGS_SECTION_NAME, "syncWithView")) {
    result.syncWithView =
      app.settings.getSetting(SETTINGS_SECTION_NAME, "syncWithView") === "true";
  } else {
    result.syncWithView = DEFAULT_SETTINGS.syncWithView;
  }

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
