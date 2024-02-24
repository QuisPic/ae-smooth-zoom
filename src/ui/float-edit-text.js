import bind from "../../extern/function-bind";

function FloatEditText(parentEl, initTextValue) {
  this.element = parentEl.add(
    "EditText { \
          active: true, \
          alignment: 'left', \
          text: '" +
      initTextValue +
      "', \
        }",
  );

  // this.element.onDraw = function (drawState) {
  //   if (drawState.hasFocus) {
  //     writeLn("focus " + $.hiresTimer);
  //   } else {
  //     writeLn("no focus " + $.hiresTimer);
  //   }
  // };

  // var g = this.element.graphics;
  // var bluePen = g.newBrush(g.BrushType.SOLID_COLOR, [0, 1, 0, 1]);
  // this.element.graphics.backgroundColor = bluePen;

  // this.element.onChange = bind(function () {
  //   if (typeof this.onChangeFn === "function") {
  //     this.onChangeFn(this.element.text);
  //   }
  // }, this);

  var blurHandler = bind(function () {
    // if (ScriptUI.environment.keyboardState.keyName === "Escape") {
    //   event.preventDefault();
    //   return;
    // }

    if (ScriptUI.environment.keyboardState.keyName === "Escape") {
      writeLn("esc " + $.hiresTimer);

      // var count = 0;
      // while (
      //   ScriptUI.environment.keyboardState.keyName === "Escape" &&
      //   count < 5000
      // ) {
      //   count++;
      // }
      //
      // if (count > 5000) {
      //   writeLn("count5000: " + $.hiresTimer);
      // } else {
      //   writeLn("no esc: " + $.hiresTimer);
      // }
    }

    if (typeof this.onBlurFn === "function") {
      this.onBlurFn();
    }
  }, this);

  /** Increment number value using arrow keys */
  // this.element.addEventListener(
  //   "keydown",
  //   bind(function (event) {
  //     if (event.eventPhase === "target") {
  //       if (event.keyName === "Up") {
  //         event.preventDefault();
  //         var val = parseFloat(this.element.text);
  //
  //         if (!isNaN(val)) {
  //           this.element.text = val + 1;
  //         }
  //       } else if (event.keyName === "Down") {
  //         event.preventDefault();
  //         val = parseFloat(this.element.text);
  //
  //         if (!isNaN(val)) {
  //           this.element.text = val - 1;
  //         }
  //       }
  //     }
  //   }, this),
  // );

  $.global.kek = blurHandler;
  this.element.onDeactivate = function () {
    app.scheduleTask("$.global.kek()", 0, false);
  };
  // this.element.onChange = blurHandler;
  // this.element.addEventListener("blur", blurHandler);
}

FloatEditText.prototype.setSize = function (size) {
  this.element.size = size;
};

FloatEditText.prototype.setOnChangeFn = function (fn) {
  this.onChangeFn = fn;
};

FloatEditText.prototype.setOnBlurFn = function (fn) {
  this.onBlurFn = fn;
};

export default FloatEditText;
