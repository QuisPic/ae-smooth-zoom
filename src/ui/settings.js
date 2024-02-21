import MenuWindow from "./menu-window";
import NumberValue from "./number-value";
import { AE_OS, OS, STICK_TO } from "../constants";
import { openURL } from "../utils";
import bind from "../../extern/function-bind";
import Checkbox from "./checkbox";
import preferences from "../preferences";
import windows from "../windows";
import SettingsWindow from "./settings/settings-window";

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
        this.menuWindow = new MenuWindow();
        var menuWindow = this.menuWindow;

        // var maxTextSize =
        //   menuWindow.element.graphics.measureString("Sync with View");
        //
        // var onScrubStartFn = bind(function () {
        //   this.menuWindow.element.shouldCloseOnDeactivate = false;
        // }, this);
        //
        // var onScrubEndFn = bind(function () {
        //   if (
        //     AE_OS === OS.WIN &&
        //     !this.menuWindow.element.shouldCloseOnDeactivate
        //   ) {
        //     // make the window active
        //     this.menuWindow.element.hide();
        //     this.menuWindow.element.show();
        //   }
        //
        //   this.menuWindow.element.shouldCloseOnDeactivate = true;
        // }, this);

        this.settingsItem = menuWindow.addMenuItem("Settings", function () {
          windows.new(new SettingsWindow(zoom));
        });

        // this.keyBindingsItem = menuWindow.addMenuItem(
        //   "Key Bindings...",
        //   function () {
        //     windows.newKeyBindingsWindow();
        //   },
        // );

        // this.syncItem = menuWindow.addMenuItem("Sync with View");

        // "Sync With Viewport" checkbox
        // this.syncCheck = new Checkbox(
        //   zoom,
        //   this.syncItem,
        //   preferences.syncWithView,
        //   function () {
        //     preferences.save("syncWithView", this.value);
        //   },
        // );
        //
        // this.syncCheck.element.check.helpTip =
        //   "If ON, the script will sync its value with the viewport when you hover over the script.";
        //
        // this.showSliderItem = menuWindow.addMenuItem(
        //   "Show Slider",
        //   function () {},
        // );

        // "Show Slider" checkbox
        // this.showSliderCheck = new Checkbox(
        //   zoom,
        //   this.showSliderItem,
        //   preferences.showSlider,
        //   function () {
        //     zoom.showHideSlider();
        //   },
        // );
        //
        // this.sliderMinItem = menuWindow.addMenuItem("Slider Min");
        // this.sliderMaxItem = menuWindow.addMenuItem("Slider Max");

        // this.sliderMinValue = new NumberValue(
        //   this.sliderMinItem,
        //   "%",
        //   preferences.sliderMin || 1,
        //   1,
        //   preferences.sliderMax,
        //   undefined,
        //   onScrubStartFn,
        //   onScrubEndFn,
        // );
        //
        // this.sliderMaxValue = new NumberValue(
        //   this.sliderMaxItem,
        //   "%",
        //   preferences.sliderMax,
        //   preferences.sliderMin || 1,
        //   undefined,
        //   undefined,
        //   onScrubStartFn,
        //   onScrubEndFn,
        // );
        //
        // this.sliderMinValue.onChangeFn = bind(function (val) {
        //   preferences.save("sliderMin", val);
        //   this.sliderMaxValue.minValue = val;
        //
        //   if (zoom.zoomSlider && isValid(zoom.zoomSlider.element)) {
        //     zoom.zoomSlider.setMin(val);
        //   }
        // }, this);
        //
        // this.sliderMaxValue.onChangeFn = bind(function (val) {
        //   preferences.save("sliderMax", val);
        //   this.sliderMinValue.maxValue = val;
        //
        //   if (zoom.zoomSlider && isValid(zoom.zoomSlider.element)) {
        //     zoom.zoomSlider.setMax(val);
        //   }
        // }, this);

        // this.showSliderItem.txtValue.preferredSize = maxTextSize;
        // this.sliderMinItem.txtValue.preferredSize = maxTextSize;
        // this.sliderMaxItem.txtValue.preferredSize = maxTextSize;

        // this.keyBindingsItem = menuWindow.addMenuItem(
        //   "Experimental...",
        //   function () {
        //     windows.newExperimentalWindow();
        //   },
        // );

        menuWindow.addDivider();
        menuWindow.addMenuItem("Author", function () {
          openURL("https://twitter.com/quismotion");
        });
        menuWindow.addMenuItem("Github", function () {
          openURL("https://github.com/QuisPic/ae-zoom");
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

export default Settings;
