const { addMissingRules } = require("./utils");

module.exports = {
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    // Override of JavaScript recommended
    "dot-notation": "off", // Produce false positives and breaks valid code
    "no-undef": "off", // This check is done by the TypeScript compiler
    "no-explicit-any": "off", // We won't force this on our users. Let them be the judge
    "no-shadow": "off", // This is not as useful as we have types for our variables

    // Apply TypeScript specific rules
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

    // Overrides of TypeScript recommended
    "@swissquote/swissquote/@typescript-eslint/explicit-function-return-type": "off",
    "@swissquote/swissquote/@typescript-eslint/explicit-member-accessibility": "off",

  }
};

addMissingRules(
  require("@typescript-eslint/eslint-plugin").configs.recommended.rules,
  module.exports.rules,
  Object.keys(require("./typescript").rules)
);
