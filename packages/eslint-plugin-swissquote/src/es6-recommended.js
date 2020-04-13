// EcmaScript 6 specific configuration
module.exports = {
  rules: {
    // General Rules
    "constructor-super": "error",
    "no-class-assign": "error",
    // Prettier messes up this rule as it removes the parens
    //"no-confusing-arrow": [
    //  "error",
    //  {
    //    allowParens: true
    //  }
    //],
    "no-const-assign": "error",
    "no-dupe-class-members": "error",
    "no-empty-pattern": "error",
    "no-new-symbol": "error",
    "no-return-await": "error",
    "no-this-before-super": "error",
    "no-useless-computed-key": "error",
    "no-useless-constructor": "error",
    "no-var": "error",
    "object-shorthand": [
      "error",
      "always",
      {
        ignoreConstructors: false,
        avoidQuotes: true
      }
    ],
    "prefer-arrow-callback": [
      "error",
      {
        allowNamedFunctions: false,
        allowUnboundThis: true
      }
    ],
    "prefer-const": [
      "error",
      {
        destructuring: "all",
        ignoreReadBeforeAssign: true
      }
    ],
    "prefer-numeric-literals": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    strict: ["error", "never"], // babel inserts `'use strict';` for us
    "symbol-description": "error",
    "no-useless-rename": "error",
  }
};
