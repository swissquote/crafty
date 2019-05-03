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
    // Code Style
    "arrow-spacing": [warn(), { before: true, after: true }],
    "brace-style": [warn(), "1tbs"],
    "comma-dangle": [warn(), "never"],
    "comma-spacing": [warn(), { before: false, after: true }],
    // "consistent-this": [warn(), "that"],
    // "func-names": warn(),
    // "func-style": warn(),
    "generator-star-spacing": ["error", { before: false, after: true }],
    indent: [
      warn(),
      2,
      { SwitchCase: 1, ignoredNodes: ["ConditionalExpression"] }
    ],
    "jsx-quotes": [warn(), "prefer-double"],
    "keyword-spacing": warn(),
    // "max-depth": [warn(), 4],
    // "max-len": [warn(), 80, 4],
    // "max-nested-callbacks": [warn(), 2],
    // "max-params": [warn(), 3],
    // "max-statements": [warn(), 10],
    "new-cap": [warn(), { newIsCapExceptions: ["default"] }],
    "new-parens": warn(),
    "no-array-constructor": warn(),
    "no-bitwise": warn(),
    // "no-div-regex": warn(),
    // "no-else-return": warn(),
    "no-empty": warn(),
    "no-empty-character-class": warn(),
    "no-extra-parens": [
      warn(),
      "all",
      {
        nestedBinaryExpressions: false,
        conditionalAssign: false,
        ignoreJSX: "multi-line"
      }
    ],
    "no-extra-semi": warn(),
    "no-floating-decimal": warn(),
    "no-lone-blocks": warn(),
    // "no-mixed-requires": [warn(), false],
    "no-multi-str": warn(),
    "no-multi-spaces": warn(),
    "no-negated-condition": warn(),
    "no-nested-ternary": warn(),
    "no-new-object": warn(),
    "no-new-wrappers": warn(),
    // "no-plusplus": 0,
    "no-self-compare": warn(),
    "no-shadow-restricted-names": warn(),
    "no-spaced-func": warn(),
    "no-sparse-arrays": warn(),
    "no-mixed-spaces-and-tabs": warn(),
    "no-trailing-spaces": warn(),
    "no-useless-concat": warn(),
    //"no-useless-escape": warn(),
    "no-void": warn(),
    "no-with": warn(),
    // "one-var": warn(),
    // "quote-props": warn(),
    quotes: [warn(), "double", "avoid-escape"],
    "rest-spread-spacing": ["error", "never"],
    semi: warn(),
    // "sort-vars": warn(),
    "space-infix-ops": warn(),
    "space-unary-ops": [warn(), { words: true, nonwords: false }],
    // "spaced-comment": [warn(), "always", { "exceptions": ["-", "+", "*"] }],
    "template-curly-spacing": warn(),
    // "wrap-regex": warn(),
    "yield-star-spacing": [warn(), "after"]
  }
};
