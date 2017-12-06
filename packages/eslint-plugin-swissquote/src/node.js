module.exports = {
  env: {
    node: true,
    browser: false,
    amd: false
  },
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module"
  },
  rules: {
    strict: ["error", "global"],
    "no-buffer-constructor": "error",
    "no-path-concat": "error",
    "no-console": "off"
  }
};
