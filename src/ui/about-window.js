import { VERSION } from "../constants";
import TextLink from "./text-link";

function AboutWindow() {
  this.element = new Window(
    "palette { \
      margins: 0, \
      spacing: 0, \
      minimumSize: [300, 100], \
      alignChildren: ['fill', 'top'], \
      pnlInfo: Panel { \
        orientation: 'row', \
        grName: Group { \
          orientation: 'column', \
          alignChildren: 'left', \
          alignment: ['left', 'top'], \
          spacing: 4, \
          txtName: StaticText { text: 'Developed by Denis Mozgovoy' }, \
        }, \
        grVersion: Group { \
          orientation: 'column', \
          alignment: ['right', 'top'], \
          alignChildren: 'left', \
          spacing: 4, \
          txtVersion: StaticText {}, \
          txtYear: StaticText { text: '2024' }, \
        }, \
      }, \
    }",
    "Zoom About",
  );

  this.element.pnlInfo.grVersion.txtVersion.text = "Zoom " + VERSION;
  this.element.pnlInfo.grName.linkSite = new TextLink(
    this.element.pnlInfo.grName,
    "Motionprincess.com",
  );
  this.element.pnlInfo.grName.linkTwitter = new TextLink(
    this.element.pnlInfo.grName,
    "X / Twitter",
  );

  this.element.layout.layout(true);
  this.element.show();
}

export default AboutWindow;
