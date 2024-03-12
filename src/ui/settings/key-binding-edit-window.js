import zoomPlugin from "../../zoomPlugin";
import BasicList from "./list/basic-list";
import KeyBindingsColumnNamesRow from "./list/key-bindings-column-names-row";
import KeyBindingsEditRow from "./list/key-bindings-edit-row";
import KeyCombination from "./key-bindings/key-combination";
import { BLUE_COLOR } from "../../constants";
import { drawRoundRect } from "../../utils";

function KeyBindingEditWindow(values) {
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
