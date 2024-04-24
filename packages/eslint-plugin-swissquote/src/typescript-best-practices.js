const { addMissingRules } = require("./utils");

module.exports = {
  files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
  languageOptions: {
    parser: require("../packages/typescript-eslint_parser.js")
  },
  rules: {
    // Override of JavaScript recommended
    "dot-notation": "off", // Produce false positives and breaks valid code
    "no-undef": "off", // This check is done by the TypeScript compiler
    "@typescript-eslint/no-explicit-any": "off", // We won't force this on our users. Let them be the judge
    "no-shadow": "off", // This is not as useful as we have types for our variables

    // Replace base rules with TypeScript specific rules
    camelcase: "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase", "PascalCase"]
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE"]
      },
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"]
      },
      {
        // Properties can come from legacy systems / libraries, don't block because of this
        selector: "property",
        format: null
      },
      {
        // A function parameter can be a class or property
        selector: "parameter",
        format: ["camelCase", "PascalCase"]
      }
    ],

    // Disable this rule for the time being, enforcing it suddenly would be too harsh
    // TODO :: enable in 2.0
    "@typescript-eslint/explicit-module-boundary-types": "off",

    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "error",

    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",

    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { args: "none", vars: "local", ignoreRestSiblings: true }
    ],

    // Overrides of TypeScript recommended
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/ban-types": "warn"
  },
  plugins: {
    "@typescript-eslint": require("../packages/typescript-eslint.js").plugin
  }
};

addMissingRules(
  require("../packages/typescript-eslint.js").configs.recommended[2].rules,
  module.exports.rules,
  Object.keys(require("./typescript").rules)
);

/*
addMissingRules(
  require("../packages/typescript-eslint.js").configs["recommended-type-checked"]
    .rules,
  module.exports.rules,
  Object.keys(require("./typescript").rules)
);
*/
