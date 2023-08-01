import { keysFromKeyCodes } from "../../utils";

function KeyCombination(parentEl, keyNames, minWidth, alignChildren) {
  /**
   a lock for sort of thread safety
   when someone presses keys too fast multiple updateKeys()
   may run simultaneously
   */
  this.updating = false;

  /** keys in the plugin format, may not be present */
  this.keyCodes = undefined;

  this.keyNames = keyNames;
  this.alignChildren = alignChildren || "left";

  this.element = parentEl.add(
    "Group { \
      alignChildren: ['fill', 'fill'], \
    }",
  );

  var g = this.element.graphics;
  this.b = g.newBrush(g.BrushType.SOLID_COLOR, [0.11, 0.11, 0.11, 1]);
  this.p = g.newPen(g.PenType.SOLID_COLOR, [0.75, 0.75, 0.75, 1], 1);

  if (minWidth) {
    this.element.minimumSize = [minWidth, 0];
  }

  this.addCombination(keyNames);
}

KeyCombination.prototype.addCombination = function (keyNames) {
  this.keyNames = keyNames;

  var gr = this.element.add(
    "Group { \
      spacing: 3, \
      alignChildren: ['" +
      this.alignChildren +
      "', 'center'], \
    }",
  );

  for (var i = 0; i < keyNames.length; i++) {
    if (!isValid(gr)) {
      break;
    }

    if (i > 0) {
      gr.add("StaticText { text: '+' }");
    }

    var pnlKey = gr.add(
      "Panel { \
        margins: [2, 1, 2, 1], \
        txt: StaticText {}, \
      }",
    );

    pnlKey.txt.text = keyNames[i];

    if (isValid(pnlKey)) {
      pnlKey.graphics.backgroundColor = this.b;
      pnlKey.txt.graphics.foregroundColor = this.p;
    }
  }
};

KeyCombination.prototype.updateKeysWithCodes = function (keyCodes) {
  var keyNames = keysFromKeyCodes(keyCodes);

  this.keyCodes = keyCodes;
  this.updateKeys(keyNames);
};

KeyCombination.prototype.updateKeys = function (keyNames) {
  try {
    if (!this.updating) {
      this.updating = true;
      var children = this.element.children;

      for (var i = children.length - 1; i >= 0; i--) {
        if (isValid(this.element.children[i])) {
          this.element.remove(i);
        }
      }

      this.addCombination(keyNames);
      this.element.window.layout.layout(true);
      this.updating = false;
    }
  } catch (error) {
    alert("Error at line " + error.line + ":\n" + error.message);
  }
};

export default KeyCombination;
