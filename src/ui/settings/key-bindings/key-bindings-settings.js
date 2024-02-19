import { updateScrollBar } from "../../../utils";
import bind from "../../../../extern/function-bind";
import KeyBinding from "./key-binding";
import Line from "../../line";
import JSON from "../../../../extern/json2";
import ColumnNames from "./column-names";
import preferences from "../../../preferences";
import windows from "../../../windows";

function KeyBindingsSettings(parentEl) {
  this.keyBindingsArr = [];
  this.linesArr = [];
  this.drawn = false;

  this.element = parentEl.add(
    "tab { \
      text: 'Key Bindings', \
      alignChildren: ['left', 'top'], \
      orientation: 'row', \
    }",
  );

  /** Save the key bindings to the AE's preferences file */
  // this.element.grButtons.btnSave.onClick = bind(function () {
  //   var bindingsArr = [];
  //
  //   for (var i = 0; i < this.keyBindingsArr.length; i++) {
  //     var bEl = this.keyBindingsArr[i].element;
  //
  //     bindingsArr.push({
  //       enabled: bEl.chkEnable.value,
  //       keyCodes: bEl.grKeys.keyCombination.keyCodes,
  //       action: bEl.ddlistAction.selection.index,
  //       amount: bEl.grAmount.numberValue.getValue(),
  //     });
  //   }
  //
  //   preferences.save("keyBindings", JSON.stringify(bindingsArr));
  //
  //   /** Close the KeyBindings window */
  //   this.element.close();
  // }, this);

  /** Cancel button */
  // this.element.grButtons.btnCancel.onClick = function () {
  //   this.window.close();
  // };
  //
  // this.element.layout.layout(true);
  // this.element.show();
}

KeyBindingsSettings.prototype.draw = function () {
  if (!this.drawn) {
    this.element.gr = this.element.add(
      "Group { \
        alignChildren: ['fill', 'top'], \
        orientation: 'column', \
        pnlKeyBindings: Panel { \
          alignment: 'fill', \
          orientation: 'column', \
          alignChildren: ['left', 'top'], \
          margins: 0, \
          spacing: 0, \
          grColumnNames: Group { \
            alignment: ['fill', 'top'], \
          }, \
          grLine: Group { \
            orientation: 'column', \
            alignment: 'fill', \
          }, \
          grBindings: Group {\
            spacing: 0, \
            alignChildren: ['left', 'top'], \
            margins: 0, \
            grList: Group { \
              spacing: 0, \
              orientation: 'column', \
            }, \
          }, \
          grLine1: Group { \
            orientation: 'column', \
            alignment: 'fill', \
          }, \
          grAdd: Group { \
            orientation: 'column', \
            alignment: 'fill', \
            alignChildren: 'center', \
            margins: 5, \
            btnAdd: IconButton { \
              title: '+', \
              preferredSize: [100, 22], \
              helpTip: 'Add key bind', \
            }, \
          }, \
        }, \
      }",
    );

    var pnlKeyBindings = this.element.gr.pnlKeyBindings;
    var keyBindings = JSON.parse(preferences.keyBindings);

    this.element.maximumSize.width = 600;
    pnlKeyBindings.grBindings.maximumSize.height = 200;

    /** Create column names for the key bindings table */
    pnlKeyBindings.grColumnNames.columnNames = new ColumnNames(
      pnlKeyBindings.grColumnNames,
      this,
    );

    /** Fill the key bindings table */
    if (keyBindings && keyBindings.length > 0) {
      for (var i = 0; i < keyBindings.length; i++) {
        if (!keyBindings[i].keyCodes) {
          continue;
        }

        this.addKeyBinding(keyBindings[i]);
      }

      /** Sync the checkbox for all items in the table */
      pnlKeyBindings.grColumnNames.columnNames.syncCheck();
    }
    Line(pnlKeyBindings.grLine);
    Line(pnlKeyBindings.grLine1);

    /** Add new key binding button */
    pnlKeyBindings.grAdd.btnAdd.onClick = bind(function () {
      windows.newKeyCaptureWindow(
        bind(function (keyNames, keyCodes) {
          this.addKeyBinding({
            enabled: true,
            keyCodes: keyCodes,
            action: 0,
            amount: 1,
          });
          this.element.gr.pnlKeyBindings.grColumnNames.columnNames.syncCheck();
          this.element.layout.layout(true);
        }, this),
      );
    }, this);

    this.element.window.layout.layout(true);
    this.drawn = true;
  }
};

KeyBindingsSettings.prototype.updateScrollBar = function () {
  updateScrollBar(this.element.gr, this.element);
  this.element.layout.layout(true);
};

KeyBindingsSettings.prototype.updateKeyBindingsScrollBar = function () {
  var grBindings = this.element.gr.pnlKeyBindings.grBindings;
  var listGr = grBindings.grList;

  updateScrollBar(listGr, grBindings);
  this.element.layout.layout(true);
};

KeyBindingsSettings.prototype.addKeyBinding = function (keyBindingValues) {
  var listGr = this.element.gr.pnlKeyBindings.grBindings.grList;

  if (this.keyBindingsArr.length > 0) {
    this.linesArr.push(new Line(listGr));
  }

  this.keyBindingsArr.push(new KeyBinding(listGr, keyBindingValues, this));

  this.element.layout.layout(true);
  this.updateKeyBindingsScrollBar();
};

KeyBindingsSettings.prototype.removeKeyBinding = function (keyBindingOrInd) {
  var kbInd;

  if (keyBindingOrInd instanceof KeyBinding) {
    kbInd = this.findKeyBindingIndex(keyBindingOrInd);
  } else if (typeof keyBindingOrInd === "number") {
    kbInd = keyBindingOrInd;
  }

  if (kbInd !== undefined) {
    this.keyBindingsArr[kbInd].element.parent.remove(
      this.keyBindingsArr[kbInd].element,
    );
    this.keyBindingsArr.splice(kbInd, 1);

    var lineInd =
      kbInd >= this.linesArr.length ? this.linesArr.length - 1 : kbInd;
    var line = this.linesArr[lineInd];

    if (line) {
      line.element.parent.remove(line.element);
      this.linesArr.splice(lineInd, 1);
    }

    this.element.layout.layout(true);
    this.updateKeyBindingsScrollBar();
  } else {
    alert("Can not remove Key Binding:\nThe Key Binding is not found.");
  }
};

KeyBindingsSettings.prototype.onOffKeyBinding = function (
  val,
  keyBindingOrInd,
) {
  var kbInd;

  if (keyBindingOrInd instanceof KeyBinding) {
    kbInd = this.findKeyBindingIndex(keyBindingOrInd);
  } else if (typeof keyBindingOrInd === "number") {
    kbInd = keyBindingOrInd;
  }

  if (kbInd !== undefined) {
    this.keyBindingsArr[kbInd].onOff(val);
  } else {
    alert("Can not enble/disable Key Binding:\nThe Key Binding is not found.");
  }
};

KeyBindingsSettings.prototype.findKeyBindingIndex = function (keyBinding) {
  var kbInd;

  for (var i = 0; i < this.keyBindingsArr.length; i++) {
    if (keyBinding === this.keyBindingsArr[i]) {
      kbInd = i;
    }
  }

  return kbInd;
};

export default KeyBindingsSettings;
