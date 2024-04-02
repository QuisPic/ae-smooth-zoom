import MenuWindow from "./menu-window";
import { STICK_TO } from "../constants";
import { openURL } from "../utils";
import bind from "../../extern/function-bind";
import windows from "../windows";
import SettingsWindow from "./settings/settings-window";
import AboutWindow from "./about-window";

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

        this.settingsItem = menuWindow.addMenuItem("Settings", function () {
          windows.new(new SettingsWindow(zoom));
        });

        menuWindow.addDivider();
        menuWindow.addMenuItem("About", function () {
          windows.new(new AboutWindow());
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
