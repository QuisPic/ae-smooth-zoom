function bind(fToBind, oThis) {
  if (fToBind.__class__ !== "Function") {
    throw new TypeError(
      "Function.prototype.bind - what is trying to be bound is not callable",
    );
  }

  var fNOP = function () {};
  var fBound = function () {
    return fToBind.apply(
      fToBind instanceof fNOP ? fToBind : oThis,
      Array.prototype.slice.call(arguments),
    );
  };

  if (this.prototype) {
    // Function.prototype doesn't have a prototype property
    fNOP.prototype = this.prototype;
  }

  fBound.prototype = new fNOP();

  return fBound;
}

export default bind;
