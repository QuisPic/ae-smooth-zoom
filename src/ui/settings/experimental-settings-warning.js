import windows from "../../windows";
import AboutWindow from "../about-window";

function ExperimentalSettingsWarning(parentEl) {
  this.element = parentEl.add(
    "Panel { \
      alignChildren: 'left', \
      spacing: 3, \
      txt0: StaticText {}, \
      txt1: StaticText {}, \
      btnContacts: IconButton { \
        title: 'Show Contacts', \
        alignment: 'right', \
        preferredSize: [-1, 22], \
      }, \
    }",
  );

  this.element.txt0.text =
    "Please note that these settings may not work as described " +
    "or may cause After Effects to crash.";
  this.element.txt1.text =
    "If you experience such issues, please report to the author.";

  this.element.btnContacts.onClick = function () {
    windows.new(AboutWindow);
  };

  this.element.graphics.backgroundColor = this.element.graphics.newBrush(
    this.element.graphics.BrushType.SOLID_COLOR,
    [0.19, 0.19, 0, 1],
  );
}

export default ExperimentalSettingsWarning;
