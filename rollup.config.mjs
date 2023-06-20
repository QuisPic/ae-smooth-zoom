export default {
  input: "src/index.js",
  output: {
    file: "dist/Zoom.jsx",
    format: "iife",
    banner: "var thisObj = this;",
  },
  external: ["thisObj"],
};
