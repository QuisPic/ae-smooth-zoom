import Zoom from "./zoom";

var zoom = new Zoom(thisObj);

if (zoom.w instanceof Panel) {
  zoom.w.layout.layout(true);
  zoom.w.layout.resize();
} else {
  zoom.w.show();
}
