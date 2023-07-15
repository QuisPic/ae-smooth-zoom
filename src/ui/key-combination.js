import { TABLE_SIZES } from "../constants";

function KeyCombination(parentEl, keysArr, alignChildren) {
  // a lock for sort of thread safety
  // when someone presses keys too fast multiple updateKeys()
  // may run simultaneously
  this.updating = false;
  this.alignChildren = alignChildren;

  this.element = parentEl.add(
    "Group { \
      alignChildren: ['fill', 'fill'], \
    }",
  );

  var g = this.element.graphics;
  this.b = g.newBrush(g.BrushType.SOLID_COLOR, [0.11, 0.11, 0.11, 1]);
  this.p = g.newPen(g.PenType.SOLID_COLOR, [0.75, 0.75, 0.75, 1], 1);

  this.element.minimumSize = [TABLE_SIZES[2], 0];
  this.addCombination(keysArr);
}

KeyCombination.prototype.addCombination = function (keysArr) {
  var gr = this.element.add(
    "Group { \
      spacing: 3, \
      alignChildren: ['" +
      this.alignChildren +
      "', 'center'], \
    }",
  );

  for (var i = 0; i < keysArr.length; i++) {
    if (!isValid(gr)) {
      break;
    }

    if (i > 0) {
      gr.add("StaticText { text: '+' }");
    }

    var pnlKey = gr.add(
      "Panel { \
        margins: [2, 1, 2, 1], \
        txt: StaticText { text: '" +
        keysArr[i] +
        "' } \
      }",
    );

    if (isValid(pnlKey)) {
      pnlKey.graphics.backgroundColor = this.b;
      pnlKey.txt.graphics.foregroundColor = this.p;
    }
  }
};

KeyCombination.prototype.updateKeys = function (keysArr) {
  if (!this.updating) {
    this.updating = true;
    var children = this.element.children;

    for (var i = children.length - 1; i >= 0; i--) {
      if (isValid(this.element.children[i])) {
        this.element.remove(i);
      }
    }

    this.addCombination(keysArr);
    this.element.window.layout.layout(true);
    this.updating = false;
  }
};

export default KeyCombination;
