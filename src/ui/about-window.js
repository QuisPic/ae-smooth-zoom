import { VERSION } from "../constants";
import TextLink from "./text-link";

function AboutWindow() {
  this.element = new Window(
    "dialog { \
      minimumSize: [300, 0], \
      alignChildren: ['fill', 'top'], \
      grTitle: Group { \
        spacing: 5, \
        orientation: 'column', \
        alignChildren: 'center', \
        txtVersion: StaticText {}, \
        txtDescription: StaticText { text: 'Improved zoom experience inside compositions.' }, \
        txtYear: StaticText { text: '2024' }, \
      }, \
      pnlReport: Panel { \
        spacing: 4, \
        alignChildren: 'fill', \
        txt: StaticText { text: 'Report Issues to:' }, \
        grGithubLink: Group {}, \
        grEmail: Group { \
          txt: StaticText { text: 'Email: ' }, \
          etxtEmail: EditText { \
            alignment: ['fill', 'center' ], \
            properties: { readonly: true }, \
            text: 'hello@motionprincess.com', \
          }, \
        }, \
      }, \
      pnlInfo: Panel { \
        orientation: 'row', \
        grName: Group { \
          orientation: 'column', \
          alignChildren: 'left', \
          alignment: ['left', 'top'], \
          spacing: 4, \
          txtName: StaticText { text: 'Developed by Denis Mozgovoy' }, \
        }, \
      }, \
      btnOK: IconButton { \
        alignment: 'right', \
        title: 'OK', \
        text: 'OK', \
        preferredSize: [100, 22], \
      }, \
    }",
    "Zoom About",
  );

  this.element.btnOK.onClick = function () {
    this.window.close();
  };

  this.element.grTitle.txtVersion.text = "Zoom " + VERSION;
  this.element.pnlInfo.grName.linkSite = new TextLink(
    this.element.pnlInfo.grName,
    "Motionprincess.com",
    "https://motionprincess.com/",
  );

  this.element.pnlInfo.grName.linkTwitter = new TextLink(
    this.element.pnlInfo.grName,
    "X / Twitter",
    "https://twitter.com/quismotion",
  );

  this.element.pnlReport.grGithubLink.linkGithubIssues = new TextLink(
    this.element.pnlReport.grGithubLink,
    "Github Issues",
    "https://github.com/QuisPic/ae-zoom/issues",
  );

  this.element.layout.layout(true);
  this.element.show();
}

export default AboutWindow;
