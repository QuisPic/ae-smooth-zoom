function Checkbox(zoom, parentEl, initVal, onClickFn) {
  var thisCheckbox = this;

  this.element = parentEl.add(
    "Group { \
      margins: [6, 0, 0, 0], \
      check: Checkbox { \
        alignment: ['left', 'bottom'], \
        preferredSize: [-1, 14], \
      }, \
    }",
  );

  this.element.check.value = initVal;
  this.element.check.onClick = onClickFn;

  parentEl.addEventListener("click", function (event) {
    if (event.eventPhase === "target") {
      thisCheckbox.element.check.notify();
    }
  });
}

export default Checkbox;
