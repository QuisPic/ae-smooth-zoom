module.exports = {
  env: {
    commonjs: true,
  },
  extends: ["eslint:recommended", "aftereffects", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    __zoomThisObj: "readonly",
    ScriptUi: "readonly",
  },
  rules: {},
};
