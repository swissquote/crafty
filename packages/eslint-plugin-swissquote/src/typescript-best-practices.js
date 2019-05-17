const { addMissingRules } = require("./utils");

module.exports = {
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    // Overrides
    camelcase: "off",
    "@swissquote/swissquote/@typescript-eslint/camelcase": [
      "error",
      { properties: "never" }
    ],

    "no-use-before-define": "off",
    "@swissquote/swissquote/@typescript-eslint/no-use-before-define": "error",

    "no-useless-constructor": "off",
    "@swissquote/swissquote/@typescript-eslint/no-useless-constructor": "error",

    "no-unused-vars": "off",
    "@swissquote/swissquote/@typescript-eslint/no-unused-vars": [
      "error",
      { args: "none", vars: "local", ignoreRestSiblings: true }
    ],

    // Be nice on our users
    "@swissquote/swissquote/@typescript-eslint/explicit-function-return-type": "off",
    "@swissquote/swissquote/@typescript-eslint/explicit-member-accessibility": "off"
  }
};

addMissingRules(
  require("@typescript-eslint/eslint-plugin").configs.recommended.rules,
  module.exports.rules,
  Object.keys(require("./typescript").rules)
);
