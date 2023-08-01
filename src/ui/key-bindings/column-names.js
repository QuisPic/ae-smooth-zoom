import EditIcon from "./edit-icon";
import TrashIcon from "./trash-icon";
import Line from "../line";
import { TABLE_SIZES } from "../../constants";
import bind from "../../../extern/function-bind";

function ColumnNames(parentEl, kbWindow) {
  this.kbWindow = kbWindow;

  this.element = parentEl.add(
    "Group { \
      spacing: 5, \
      margins: [10, 0, 10, 0], \
      alignment: ['fill', 'top'], \
      cCheck: Checkbox {}, \
      grLine0: Group { alignment: 'fill' }, \
      grEditIcon: Group {}, \
      grLine1: Group { alignment: 'fill' }, \
      txtKeyboard: StaticText { text: 'Key Combination' }, \
      grLine2: Group { alignment: 'fill' }, \
      txtAction: StaticText { text: 'Action' }, \
      grLine3: Group { alignment: 'fill' }, \
      txtAmount: StaticText { text: '%' }, \
      grLine4: Group { alignment: 'fill' }, \
    }",
  );

  this.element.trashIcon = new TrashIcon(this.element, false);

  var cCheck = this.element.cCheck;
  var grEditIcon = this.element.grEditIcon;
  var txtKeyboard = this.element.txtKeyboard;
  var txtAction = this.element.txtAction;
  var txtAmount = this.element.txtAmount;
  var trashIcon = this.element.trashIcon.element;

  cCheck.preferredSize = [TABLE_SIZES[0], 14];
  grEditIcon.preferredSize = [TABLE_SIZES[1], -1];
  grEditIcon.minimumSize = [TABLE_SIZES[1], -1];
  txtKeyboard.preferredSize = [TABLE_SIZES[2], -1];
  txtAction.preferredSize = [TABLE_SIZES[3], -1];
  txtAmount.preferredSize = [TABLE_SIZES[4], -1];
  trashIcon.preferredSize = [TABLE_SIZES[5], -1];

  grEditIcon.editIcon = new EditIcon(grEditIcon, false);

  new Line(this.element.grLine0);
  new Line(this.element.grLine1);
  new Line(this.element.grLine2);
  new Line(this.element.grLine3);
  new Line(this.element.grLine4);

  cCheck.onClick = bind(function () {
    var kbArray = this.kbWindow.keyBindingsArr;

    for (var i = kbArray.length - 1; i >= 0; i--) {
      this.kbWindow.onOffKeyBinding(this.element.cCheck.value, i);
    }
  }, this);

  // cCheck.onDraw = function () {
  //   var g = this.graphics;
  //   var c = [0.55, 0.55, 0.55, 1];
  //   var p = g.newPen(g.PenType.SOLID_COLOR, c, 2);

  //   g.moveTo(2, 3);
  //   g.lineTo(5, 6);
  //   g.lineTo(10, 0);
  //   g.strokePath(p);
  // };
}

ColumnNames.prototype.syncCheck = function () {
  var val = false;
  var keyBindingsArr = this.kbWindow.keyBindingsArr;

  for (var i = 0; i < keyBindingsArr.length; i++) {
    if (keyBindingsArr[i].element.chkEnable.value) {
      val = true;
      break;
    }
  }

  this.element.cCheck.value = val;
}

export default ColumnNames;
