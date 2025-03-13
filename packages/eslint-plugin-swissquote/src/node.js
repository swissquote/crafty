const globals = require("../packages/globals");

module.exports = {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.amd
    },
    // Defined by cross-referencing the data on
    // https://node.green/ and Crafty's supported node version
    ecmaVersion: 2022
  },
  rules: {
    strict: ["error", "global"],
    "no-buffer-constructor": "error",
    "no-path-concat": "error",
    "no-console": "off"
  }
};
