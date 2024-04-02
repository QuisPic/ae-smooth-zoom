export default {
  input: "src/index.js",
  output: {
    file: "dist/Zoom.jsx",
    format: "iife",
    banner: "var __zoomThisObj = this;",
  },
  external: ["__zoomThisObj"],
};
