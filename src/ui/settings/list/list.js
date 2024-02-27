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

  this.element.grList.grColumns.addEventListener("mousedown", function () {
    writeLn("list click: " + $.hiresTimer);
  });
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
  var grSlider = this.element.grList.grSlider;
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

      if (!grSlider) {
        /** slider to scroll the list using mouse wheel */
        grSlider = this.element.grList.add(
          "Group {\
            alignment: 'top', \
            maximumSize: [1, 1], \
            slider: Slider { \
              minvalue: -1, \
              maxvalue: 1, \
            }, \
          }"
        );

        /** remove all appearance on the slider */
        grSlider.slider.onDraw = function () {};

        grSlider.slider.onChanging = function () {
          scrollBar.value += this.value * 8;
          scrollBar.notify();

          this.value = 0;
        };

        /** remove mousedown event */
        grSlider.slider.addEventListener("mousedown", function (event) {
          writeLn("slider click: " + $.hiresTimer);
          
          if (event.cancelable) {
            event.preventDefault();
          }
        });
        
        this.element.grList.grSlider = grSlider;
        
        this.element.grList.addEventListener("mousemove", function (event) {
          grSlider.location.x = event.clientX;
          grSlider.location.y = event.clientY;
        });
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
