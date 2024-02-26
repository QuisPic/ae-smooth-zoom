import bind from "../../../../extern/function-bind";
import Column from "./column";

function List(parentEl) {
  this.columns = [];

  this.element = parentEl.add(
    "Panel { \
      margins: 0, \
      alignment: ['fill', 'fill'], \
      orientation: 'row', \
      grList: Group { \
        orientation: 'stack', \
        alignment: ['fill', 'top'], \
        alignChildren: 'fill', \
        grColumns: Group { \
          alignment: ['fill', 'top'], \
          alignChildren: ['fill', 'top'], \
          spacing: 0, \
        }, \
      }, \
    }",
  );

  this.element.graphics.backgroundColor = this.element.graphics.newBrush(
    this.element.graphics.BrushType.SOLID_COLOR,
    [0.113, 0.113, 0.113, 1],
  );
}

List.prototype.setMaxSize = function (maxSize) {
  this.element.grList.maximumSize = maxSize;
  this.element.grList.size = maxSize;
};

List.prototype.addColumn = function (name) {
  var column = new Column(this.element.grList.grColumns, name);

  this.columns.push(column);
  return column;
};

List.prototype.updateScrollBar = function () {
  if (!this.element.grList.grColumns.size) {
    this.element.grList.layout.layout(true);
  }

  var scrollBar = this.element.scrollBar;
  var scrollSlider = this.element.grList.scrollSlider;
  var sizeDiff =
    this.element.grList.grColumns.size.height - this.element.grList.size.height;

  if (sizeDiff > 0) {
    if (!scrollBar) {
      scrollBar = this.element.add(
        "Scrollbar { \
          alignment: ['right', 'fill'], \
        }",
      );

      scrollBar.maximumSize.width = 12;
      scrollBar.onChange = bind(function () {
        this.element.grList.grColumns.location.y =
          -this.element.scrollBar.value;
      }, this);
      scrollBar.onChanging = scrollBar.onChange;

      this.element.scrollBar = scrollBar;

      if (!scrollSlider) {
        /** slider that will be used to scroll with mouse wheel */
        scrollSlider = this.element.grList.add("slider");
        scrollSlider.minvalue = -1;
        scrollSlider.maxvalue = 1;

        /** remove all appearance on the slider */
        scrollSlider.onDraw = function () {};

        scrollSlider.oldValue = scrollSlider.value;
        scrollSlider.onChange = function () {
          scrollBar.value += this.value * 5;
          scrollBar.notify();

          this.value = 0;
        };
        scrollSlider.onChanging = scrollSlider.onChange;

        /** TODO: remove onClick event */
        scrollSlider.onClick = function () {};

        this.element.grList.scrollSlider = scrollSlider;
      }
    }

    scrollBar.minvalue = 0;
    scrollBar.maxvalue = sizeDiff;

    return true;
  } else if (scrollBar) {
    this.element.remove(scrollBar);
    this.element.scrollBar = undefined;

    if (scrollSlider) {
      this.element.grList.remove(scrollSlider);
      this.element.grList.scrollSlider = undefined;
    }

    return true;
  }

  return false;
};

export default List;
