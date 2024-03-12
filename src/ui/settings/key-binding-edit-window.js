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

  // this.element = new Window(
  //   "palette { \
  //     properties: { \
  //       resizeable: false, \
  //     }, \
  //     alignChildren: ['fill', 'top'], \
  //     pnlKeyCapture: Panel { \
  //       alignChildren: ['center', 'center'], \
  //       txt0: StaticText { \
  //         text: 'Click on element below to change key combination.', \
  //       }, \
  //       pnlCapture: Panel { \
  //         alignment: ['fill', 'center'], \
  //         alignChildren: ['fill', 'fill'], \
  //       }, \
  //       grBottomText : Group { \
  //         spacing: 4, \
  //         visible: false, \
  //         txt0: StaticText { text: 'Press' }, \
  //         grEnter: Group {}, \
  //         txt1: StaticText { text: 'to accept.' }, \
  //         grEscape: Group {}, \
  //         txt2: StaticText { text: 'to cancel.' }, \
  //       }, \
  //     }, \
  //     pnlAction: Panel { \
  //       orientation: 'row', \
  //       grAction: Group { \
  //         spacing: 4, \
  //         txt: StaticText { text: 'Action:' }, \
  //         ddlistAction: DropDownList { \
  //           properties: { \
  //             items: ['[+] Add', '[-] Subtract', '[=] Set To'] \
  //           }, \
  //         }, \
  //       }, \
  //       grAmount: Group { \
  //         alignment: ['right', 'center'], \
  //         spacing: 4, \
  //         txt: StaticText { text: 'Amount:' }, \
  //       }, \
  //     }, \
  //     grButtons: Group { \
  //       alignment: ['fill', 'bottom'], \
  //       margins: 10, \
  //       alignChildren: ['right', 'center'], \
  //       btnSave: IconButton { title: 'OK', preferredSize: [100, 22] }, \
  //       btnCancel: IconButton { title: 'Cancel', preferredSize: [100, 22] }, \
  //     }, \
  //   }",
  // );

  // var pnlKeyCapture = this.element.pnlKeyCapture;
  // pnlKeyCapture.grBottomText.grEnter.keyCombination = new KeyCombination(
  //   pnlKeyCapture.grBottomText.grEnter,
  //   ["Enter"],
  // );
  // pnlKeyCapture.grBottomText.grEscape.keyCombination = new KeyCombination(
  //   pnlKeyCapture.grBottomText.grEscape,
  //   ["Escape"],
  // );
  //
  // this.keyCombination = new KeyCombination(
  //   pnlKeyCapture.pnlCapture,
  //   [],
  //   undefined,
  //   "center",
  // );
  // this.keyCombination.updateKeysWithCodes(values.keyCodes);
  //
  // pnlKeyCapture.layout.layout(true);
  // pnlKeyCapture.pnlCapture.minimumSize = pnlKeyCapture.pnlCapture.size;
  //
  // pnlKeyCapture.pnlCapture.addEventListener(
  //   "click",
  //   bind(function () {
  //     this.startKeyCapture();
  //   }, this),
  // );
  //
  // var grAmount = this.element.pnlAction.grAmount;
  // grAmount.numberValue = new NumberValue(
  //   grAmount,
  //   "%",
  //   undefined,
  //   0,
  //   undefined,
  //   undefined,
  //   undefined,
  //   // onChangeFn,
  // );
  //
  // if (values) {
  //   this.element.pnlAction.grAction.ddlistAction.selection = values.action;
  //   grAmount.numberValue.setValue(values.amount);
  // }

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
