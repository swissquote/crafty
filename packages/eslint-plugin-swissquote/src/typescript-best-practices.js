const { addMissingRules } = require("./utils");

module.exports = {
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    // Override of JavaScript recommended
    "dot-notation": "off", // Produce false positives and breaks valid code
    "no-undef": "off", // This check is done by the TypeScript compiler
    "@swissquote/swissquote/@typescript-eslint/no-explicit-any": "off", // We won't force this on our users. Let them be the judge
    "no-shadow": "off", // This is not as useful as we have types for our variables

    // Replace base rules with TypeScript specific rules
    camelcase: "off",
    "@swissquote/swissquote/@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "default",
        "format": ["camelCase", "PascalCase"]
      },
      {
        "selector": "variable",
        "format": ["camelCase", "PascalCase", "UPPER_CASE"]
      },
      {
        // Properties can come from legacy systems / libraries, don't block because of this
        "selector": "property",
        "format": null
      },
      {
        // A function parameter can be a class or property
        "selector": "parameter",
        "format": ["camelCase", "PascalCase"]
      }
    ],

    // Disable this rule for the time being, enforcing it suddenly would be too harsh
    // TODO :: enable in 2.0
    "@swissquote/swissquote/@typescript-eslint/explicit-module-boundary-types": "off",

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
    "@swissquote/swissquote/@typescript-eslint/no-empty-function": "warn",
  }
};

addMissingRules(
  require("@typescript-eslint/eslint-plugin").configs.recommended.rules,
  module.exports.rules,
  Object.keys(require("./typescript").rules)
);
