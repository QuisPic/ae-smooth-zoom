import { AE_OS, OS } from "../constants";

function ScreenWindow(numberValue, screenBounds, onMouseMoveFn, onCloseFn) {
  this.element = new Window(
    "palette { \
      alignChildren: ['fill','fill'], \
      margins: 0, \
      properties: { borderless: true } \
      gr: Button {}, \
    }",
  );

  this.element.opacity = AE_OS === OS.WIN ? 0.01 : 0;
  this.element.size = [200, 200];

  // remove all drawing on the button
  this.element.gr.onDraw = function () {};

  // make the window move after the mouse cursor
  this.element.gr.addEventListener("mousemove", function (event) {
    this.window.location = [
      event.screenX - this.window.size[0] / 2,
      event.screenY - this.window.size[1] / 2,
    ];

    onMouseMoveFn(event);
  });

  // if we move the cursor too fast the cursor may go out of window bounds
  this.element.gr.addEventListener("mouseout", function (event) {
    if (event.eventPhase === "target") {
      onCloseFn();
    }
  });

  this.element.gr.onClick = function () {
    onCloseFn();
  };

  this.element.gr.addEventListener("mouseup", function (event) {
    if (event.eventPhase === "target") {
      onCloseFn();
    }
  });

  this.element.show();
  this.element.location = [
    numberValue.lastMousePosition[0] - this.element.size[0] / 2,
    numberValue.lastMousePosition[1] - this.element.size[1] / 2,
  ];
}

export default ScreenWindow;
