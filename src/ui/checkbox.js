function Checkbox(parentEl, txt, containerGroup) {
  if (containerGroup) {
    containerGroup.spacing = 2;
  } else {
    containerGroup = parentEl.add("Group { spacing: 2 }");
  }

  this.element = containerGroup;
  this.element.check = this.element.add("Checkbox { preferredSize: [-1, 14] }");
  this.element.txt = this.element.add("StaticText { text: '" + txt + "' }");

  /** Make clicks on the text next to a check act as click on the check */
  this.element.addEventListener("click", function (event) {
    if (event.eventPhase === "target") {
      this.check.notify();
    }
  });
}

Checkbox.prototype.setValue = function (value) {
  this.element.check.value = value;
};

Checkbox.prototype.setOnClick = function (fn) {
  this.element.check.onClick = fn;
};

export default Checkbox;
