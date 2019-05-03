const { warn } = require("./utils");

// EcmaScript 6 specific configuration
module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },

    // typescript-eslint specific options
    warnOnUnsupportedTypeScriptVersion: true
  },
  rules: {
    "no-array-constructor": "off",
    "@swissquote/swissquote/@typescript-eslint/no-array-constructor": warn(),

    "@swissquote/swissquote/@typescript-eslint/type-annotation-spacing": warn(),

    indent: "off",
    "@swissquote/swissquote/@typescript-eslint/indent": [warn(), 2],

    semi: "off",
    // TODO :: enable this on next release of eslint rules
    //"@swissquote/swissquote/@typescript-eslint/semi": [warn()],

    "no-extra-parens": "off",
    "@swissquote/swissquote/@typescript-eslint/no-extra-parens": [
      warn(),
      "all",
      {
        nestedBinaryExpressions: false,
        conditionalAssign: false,
        ignoreJSX: "multi-line"
      }
    ]
  }
};
