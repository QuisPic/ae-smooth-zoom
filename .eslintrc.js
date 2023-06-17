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
    thisObj: 'readonly',
  }
  rules: {},
};
