import MenuWindow from "./menu-window";
import NumberValue from "./number-value";
import { AE_OS, OS, STICK_TO } from "../constants";
import { openURL } from "../utils";
import bind from "../../extern/function-bind";
import Checkbox from "./checkbox";
import PluginWindow from "./plugin-window";
import preferences from "../preferences";

function Settings(zoom, parentEl) {
  this.element = parentEl.add(
    "Group { \
      alignChildren: ['center', 'center'], \
      margins: [5, 0, 5, 0], \
      grDots: Custom { preferredSize: [4, 20] }, \
    }",
  );

  this.element.grDots.addEventListener("mouseover", function () {
    this.notify("onDraw");
  });

  this.element.grDots.addEventListener("mouseout", function () {
    this.notify("onDraw");
  });

  this.element.grDots.onDraw = function (drawState) {
    var g = this.graphics;
    var c = drawState.mouseOver ? [0.75, 0.75, 0.75, 1] : [0.55, 0.55, 0.55, 1];
    var b = g.newBrush(g.BrushType.SOLID_COLOR, c);

    g.ellipsePath(0, 4, 2, 2);
    g.fillPath(b);

    g.ellipsePath(0, 9, 2, 2);
    g.fillPath(b);

    g.ellipsePath(0, 14, 2, 2);
    g.fillPath(b);
  };

  this.element.addEventListener(
    "click",
    bind(function (event) {
      if (event.eventPhase === "target") {
        // var zoomSettings = Settings.getSettings();

        this.menuWindow = new MenuWindow();
        var menuWindow = this.menuWindow;

        var maxTextSize =
          menuWindow.element.graphics.measureString("Sync with View");

        var onScrubStartFn = function () {
          menuWindow.element.shouldCloseOnDeactivate = false;
        };

        var onScrubEndFn = function () {
          menuWindow.element.shouldCloseOnDeactivate = true;

          if (AE_OS === OS.WIN) {
            // make the window active
            menuWindow.element.hide();
            menuWindow.element.show();
          }
        };

        this.keyBindingsItem = menuWindow.addMenuItem(
          "Key Bindings...",
          function () {
            var plugingW = new PluginWindow();

            menuWindow.plugingW = plugingW;
            plugingW.element.show();
          },
        );

        // we pass this empty function because there is a strage bug
        // in AE where if a window doesn't have a reference to a function
        // it will close immediately
        this.syncItem = menuWindow.addMenuItem(
          "Sync with View",
          function () {},
        );

        // "Sync With Viewport" checkbox
        this.syncCheck = new Checkbox(
          zoom,
          this.syncItem,
          preferences.syncWithView,
          function () {
            preferences.save("syncWithView", this.value);
          },
        );

        this.syncCheck.element.check.helpTip =
          "If ON, the script will sync its value with the viewport when you hover over the script.";

        this.showSliderItem = menuWindow.addMenuItem(
          "Show Slider",
          function () {},
        );

        // "Show Slider" checkbox
        this.showSliderCheck = new Checkbox(
          zoom,
          this.showSliderItem,
          preferences.showSlider,
          function () {
            zoom.showHideSlider();
          },
        );

        this.sliderMinItem = menuWindow.addMenuItem("Slider Min");
        this.sliderMaxItem = menuWindow.addMenuItem("Slider Max");

        this.sliderMinValue = new NumberValue(
          this.sliderMinItem,
          "%",
          preferences.sliderMin || 1,
          1,
          preferences.sliderMax,
          undefined,
          onScrubStartFn,
          onScrubEndFn,
        );

        this.sliderMaxValue = new NumberValue(
          this.sliderMaxItem,
          "%",
          preferences.sliderMax,
          preferences.sliderMin || 1,
          undefined,
          undefined,
          onScrubStartFn,
          onScrubEndFn,
        );

        this.sliderMinValue.onChangeFn = bind(function (val) {
          preferences.save("sliderMin", val);
          this.sliderMaxValue.minValue = val;

          if (zoom.zoomSlider && isValid(zoom.zoomSlider.element)) {
            zoom.zoomSlider.setMin(val);
          }
        }, this);

        this.sliderMaxValue.onChangeFn = bind(function (val) {
          preferences.save("sliderMax", val);
          this.sliderMinValue.maxValue = val;

          if (zoom.zoomSlider && isValid(zoom.zoomSlider.element)) {
            zoom.zoomSlider.setMax(val);
          }
        }, this);

        this.showSliderItem.txtValue.preferredSize = maxTextSize;
        this.sliderMinItem.txtValue.preferredSize = maxTextSize;
        this.sliderMaxItem.txtValue.preferredSize = maxTextSize;

        menuWindow.addDivider();
        menuWindow.addMenuItem("Author", function () {
          openURL("https://twitter.com/quismotion");
        });
        menuWindow.addMenuItem("Github", function () {
          openURL("https://github.com/QuisPic/ae-smooth-zoom");
        });

        menuWindow.element.opacity = 0;
        menuWindow.element.show();
        menuWindow.stickTo(
          this.element,
          STICK_TO.RIGHT,
          event,
          this.element.grDots,
        );
        menuWindow.element.opacity = 1;
      }
    }, this),
  );
}

// Settings.getSettings = function () {
//   var result = {};

//   if (app.settings.haveSetting(SETTINGS_SECTION_NAME, "keyBindings")) {
//     result.keyBindings = app.settings.getSetting(
//       SETTINGS_SECTION_NAME,
//       "keyBindings",
//     );
//   } else {
//     result.keyBindings = DEFAULT_SETTINGS.keyBindings;
//   }

//   if (app.settings.haveSetting(SETTINGS_SECTION_NAME, "syncWithView")) {
//     result.syncWithView =
//       app.settings.getSetting(SETTINGS_SECTION_NAME, "syncWithView") === "true";
//   } else {
//     result.syncWithView = DEFAULT_SETTINGS.syncWithView;
//   }

//   if (app.settings.haveSetting(SETTINGS_SECTION_NAME, "showSlider")) {
//     result.showSlider =
//       app.settings.getSetting(SETTINGS_SECTION_NAME, "showSlider") === "true";
//   } else {
//     result.showSlider = DEFAULT_SETTINGS.showSlider;
//   }

//   if (app.settings.haveSetting(SETTINGS_SECTION_NAME, "sliderMin")) {
//     result.sliderMin = parseInt(
//       app.settings.getSetting(SETTINGS_SECTION_NAME, "sliderMin"),
//     );
//   } else {
//     result.sliderMin = DEFAULT_SETTINGS.sliderMin;
//   }

//   if (app.settings.haveSetting(SETTINGS_SECTION_NAME, "sliderMax")) {
//     result.sliderMax = parseInt(
//       app.settings.getSetting(SETTINGS_SECTION_NAME, "sliderMax"),
//     );
//   } else {
//     result.sliderMax = DEFAULT_SETTINGS.sliderMax;
//   }

//   return result;
// };

export default Settings;
