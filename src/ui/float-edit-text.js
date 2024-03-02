import bind from "../../extern/function-bind";

function FloatEditText(parentEl, initTextValue) {
  this.parentEl = parentEl;
  this.blurTaskId = undefined;

  this.element = parentEl.add(
    "EditText { \
          active: true, \
          alignment: 'left', \
          text: '" +
      initTextValue +
      "', \
        }",
  );

  this.element.onChange = bind(function () {
    if (
      typeof this.onChangeFn === "function" &&
      ScriptUI.environment.keyboardState.keyName === "Enter"
    ) {
      this.onChangeFn(this.element.text);
    }
  }, this);

  /** Increment number value using arrow keys */
  this.element.addEventListener(
    "keyup",
    bind(function (event) {
      if (event.eventPhase === "target") {
        if (event.keyName === "Up") {
          event.preventDefault();
          var val = parseFloat(this.element.text);

          if (!isNaN(val)) {
            this.element.text = val + 1;
          }
        } else if (event.keyName === "Down") {
          event.preventDefault();
          val = parseFloat(this.element.text);

          if (!isNaN(val)) {
            this.element.text = val - 1;
          }
        }
      }
    }, this),
  );

  /** Put onDeactivate handler in the gloval scope
   * to later call this handler from a task. */
  $.global.__zoom_blur_handler = bind(function () {
    /** check if this element has put the task */
    if (!this.blurTaskId) {
      return;
    }

    if (typeof this.onBlurFn === "function") {
      this.onBlurFn();
    }

    this.removeSelf();
  }, this);

  /** If a user presses Escape it may stop any code execution on Windows. In this case
   * the callback won't finish. Putting the callback in a task fixes this behavior. */
  this.element.onDeactivate = bind(function () {
    this.blurTaskId = app.scheduleTask(
      "$.global.__zoom_blur_handler()",
      0,
      false,
    );
  }, this);
}

FloatEditText.prototype.setSize = function (size) {
  this.element.size = size;
};

FloatEditText.prototype.setLocation = function (location) {
  this.element.location = location;
};

FloatEditText.prototype.setOnChangeFn = function (fn) {
  this.onChangeFn = fn;
};

FloatEditText.prototype.setOnBlurFn = function (fn) {
  this.onBlurFn = fn;
};

FloatEditText.prototype.removeSelf = function () {
  if (this.element && isValid(this.element)) {
    this.parentEl.remove(this.element);
  }
};

export default FloatEditText;
