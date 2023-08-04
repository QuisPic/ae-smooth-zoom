import { AE_OS, OS, STICK_TO } from "../constants";
import { getElementLocationInWindow, getPrimaryScreen } from "../utils";

function MenuWindow() {
  this.element = new Window("palette", undefined, undefined, {
    // borderless doesn't work on MacOS so it's better to turn it off
    // to leave the "close" button visible
    borderless: AE_OS === OS.WIN ? true : false,
  });

  this.element.margins = 0;
  this.element.spacing = 0;
  this.element.alignChildren = ["fill", "top"];
  this.element.shouldCloseOnDeactivate = true;

  this.element.onDeactivate = function () {
    if (this.shouldCloseOnDeactivate) {
      this.close();
    }
  };

  this.element.pnl = this.element.add(
    "Panel { \
      spacing: 0, \
      margins: 0, \
      alignChildren: ['fill', 'top'], \
    }",
  );
}

// by default sticks this window to the clickEl, but if the targetEl is provided sticks to targetEl
MenuWindow.prototype.stickTo = function (
  clickEl,
  stickTo,
  mouseEvent,
  targetEl,
) {
  targetEl = targetEl ? targetEl : clickEl;

  var location = [
    mouseEvent.screenX - mouseEvent.clientX,
    mouseEvent.screenY - mouseEvent.clientY + targetEl.size[1],
  ];

  if (targetEl !== clickEl) {
    location +=
      getElementLocationInWindow(targetEl) -
      getElementLocationInWindow(clickEl);
  }

  if (stickTo === STICK_TO.RIGHT) {
    location[0] += targetEl.size[0] - this.element.size[0];
  }

  // if the window is too long to fit in the screen height then make the list go up
  var primaryScreen = getPrimaryScreen();
  if (location[1] + this.element.size[1] > primaryScreen.bottom) {
    location[1] -= targetEl.size[1] + this.element.size[1];
  }

  this.element.frameLocation = location;
};

MenuWindow.prototype.addMenuItem = function (name, onClickFn) {
  var thisWindow = this;
  var valGroup = this.element.pnl.add(
    "Group { \
      margins: [7, 3, 15, 3], \
      preferredSize: [-1, 22], \
      alignChildren: ['left', 'center'], \
      txtValue: StaticText {}, \
    }",
  );

  var txtValue = valGroup.txtValue;
  txtValue.text = name;
  txtValue.graphics.foregroundColor = txtValue.graphics.newPen(
    txtValue.graphics.PenType.SOLID_COLOR,
    [0.75, 0.75, 0.75, 1],
    1,
  );

  var g = valGroup.graphics;
  g.backgroundColor = g.newBrush(
    g.BrushType.SOLID_COLOR,
    [0.12, 0.12, 0.12, 1],
  );

  valGroup.addEventListener("mouseover", function () {
    g.backgroundColor = g.newBrush(
      g.BrushType.SOLID_COLOR,
      [0.27, 0.27, 0.27, 1],
    );
  });

  valGroup.addEventListener("mouseout", function () {
    g.backgroundColor = g.newBrush(
      g.BrushType.SOLID_COLOR,
      [0.12, 0.12, 0.12, 1],
    );
  });

  if (typeof onClickFn === "function") {
    valGroup.addEventListener("click", function (event) {
      if (event.eventPhase === "target") {
        onClickFn();
        thisWindow.element.close();
      }
    });
  }

  return valGroup;
};

MenuWindow.prototype.addDivider = function () {
  this.element.pnl.add("panel");
};

export default MenuWindow;
