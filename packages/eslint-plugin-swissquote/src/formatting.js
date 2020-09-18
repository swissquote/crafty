const { warn } = require("./utils");

// Command line formatting checker
// Mainly the formatting rules and
// basic mistakes catching
module.exports = {
  env: {
    browser: true,
    node: false,
    amd: true
  },
  rules: {
    "@swissquote/swissquote/prettier/prettier": [warn(), { parser: "babel" }],

    // Code Style
    "new-cap": [warn(), { newIsCapExceptions: ["default"] }],
    "no-array-constructor": warn(),
    "no-bitwise": warn(),
    "no-empty": warn(),
    "no-empty-character-class": warn(),
    "no-lone-blocks": warn(),
    "no-multi-str": warn(),
    "no-nested-ternary": warn(),
    "no-new-object": warn(),
    "no-new-wrappers": warn(),
    "no-self-compare": warn(),
    "no-shadow-restricted-names": warn(),
    "no-sparse-arrays": warn(),
    "no-useless-concat": warn(),
    "no-void": warn(),
    "no-with": warn()
  }
};
