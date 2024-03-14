import zoomPlugin from "../../zoomPlugin";
import BasicList from "./list/basic-list";
import KeyBindingsColumnNamesRow from "./list/key-bindings-column-names-row";
import KeyBindingsEditRow from "./list/key-bindings-edit-row";
import KeyCombination from "./key-bindings/key-combination";
import { BLUE_COLOR, EVENT_KEY_PRESSED, VC_ENTER } from "../../constants";
import { drawRoundRect } from "../../utils";
import bind from "../../../extern/function-bind";

function KeyBindingEditWindow(values, row) {
  if (!zoomPlugin.isAvailable()) {
    alert(
      "Zoom plug-in is not found.\nPlease install Zoom plug-in to use key bindings.",
    );
    return;
  }

  this.element = new Window(
    "palette { \
      properties: { \
        resizeable: false, \
      }, \
      minimumSize: [500, 0], \
      alignChildren: 'fill', \
    }",
    "Edit Key Binding",
  );

  var editList = new BasicList(this.element);
  editList.editWindow = this;
  editList.RowClass = KeyBindingsEditRow;
  editList.ColumnNamesClass = KeyBindingsColumnNamesRow;
  editList.addColumnNames();
  editList.contents.push(values);
  editList.build();
  editList.refresh();

  this.element.grCaptureInfo = this.element.add(
    "Group { \
      orientation: 'stack', \
      alignChildren: 'fill', \
      alignment: ['fill', 'bottom'], \
    }",
  );

  this.element.grButtons = this.element.add(
    "Group { \
      alignment: ['fill', 'bottom'], \
      alignChildren: ['right', 'center'], \
      btnSave: IconButton { title: 'OK', preferredSize: [100, 22] }, \
      btnCancel: IconButton { title: 'Cancel', preferredSize: [100, 22] }, \
    }",
  );

  this.element.grButtons.btnSave.addEventListener("mouseover", function () {
    editList.rows[0].isMouseOverSaveBtn = true;
  });

  this.element.grButtons.btnSave.addEventListener("mouseout", function () {
    editList.rows[0].isMouseOverSaveBtn = false;
  });

  this.element.grButtons.btnSave.onClick = bind(function () {
    /** if key capturing, save the currently pressed keys */
    if (editList.rows[0].isKeyCapturing) {
      editList.rows[0].passFn(EVENT_KEY_PRESSED, undefined, VC_ENTER);
    }

    if (isValid(this.element)) {
      var newValues = editList.rows[0].getValues();
      this.element.close();

      row.edit(newValues);
      row.checkClick(newValues.enabled);
      row.list.refresh();
    }
  }, this);

  this.element.grButtons.btnCancel.onClick = bind(function () {
    this.element.close();
  }, this);

  /** End key capture if the window is closed */
  this.element.onClose = function () {
    editList.rows[0].endKeyCapture();

    /** If new key bind doesn't have any key codes delete it */
    if (!editList.rows[0].keyCodes) {
      row.list.deleteRow(row);
    }
  };

  /** If this is new key bind */
  if (!values) {
    editList.rows[0].startKeyCapture();
  }

  this.element.layout.layout(true);
  this.element.show();
}

KeyBindingEditWindow.prototype.addCaptureInfo = function () {
  var grCaptureInfo = this.element.grCaptureInfo;

  var grStroke = grCaptureInfo.add(
    "Group { \
      alignChildren: ['fill', 'fill'], \
      strokeEl: Custom {}, \
    }",
  );
  grStroke.onDraw = function () {
    var g = this.graphics;
    var b = g.newBrush(g.BrushType.SOLID_COLOR, [0, 0, 0, 1]);
    var p = g.newPen(g.PenType.SOLID_COLOR, BLUE_COLOR, 2);
    drawRoundRect(0, g, b, p, this.size);
  };

  grCaptureInfo.grText = grCaptureInfo.add(
    "Group { \
      orientation: 'column', \
      margins: 10, \
      txtTop: StaticText { \
        text: 'Press desired key combination. You can use keyboard and mouse.', \
      }, \
      grBottomText: Group { \
        spacing: 4, \
        txt0: StaticText { text: 'Press' }, \
        grEnter: Group {}, \
        txt1: StaticText { text: 'to accept.' }, \
        grEscape: Group {}, \
        txt2: StaticText { text: 'to cancel.' }, \
      }, \
    }",
  );

  grCaptureInfo.grText.grBottomText.grEnter.keyCombination = new KeyCombination(
    grCaptureInfo.grText.grBottomText.grEnter,
    ["Enter"],
  );
  grCaptureInfo.grText.grBottomText.grEscape.keyCombination =
    new KeyCombination(grCaptureInfo.grText.grBottomText.grEscape, ["Escape"]);

  this.element.layout.layout(true);
};

KeyBindingEditWindow.prototype.deleteCaptureInfo = function () {
  var grCaptureInfo = this.element.grCaptureInfo;
  for (var i = grCaptureInfo.children.length - 1; i >= 0; i--) {
    grCaptureInfo.remove(i);
  }

  this.element.layout.layout(true);
  this.element.size[1] -= grCaptureInfo.size[1];
  grCaptureInfo.size[1] = 0;
  this.element.layout.resize();
};

export default KeyBindingEditWindow;
