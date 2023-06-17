export default {
  input: "src/index.js",
  output: {
    file: "dist/zoom.jsx",
    format: "iife",
    banner: "var thisObj = this;",
  },
  external: ["thisObj"],
};
