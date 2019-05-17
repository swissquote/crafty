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
    "@swissquote/swissquote/prettier/prettier": [warn(), { parser: "typescript" }],

    "no-array-constructor": "off",
    "@swissquote/swissquote/@typescript-eslint/no-array-constructor": warn(),

    // Implemented by prettier
    indent: "off",
    "@swissquote/swissquote/@typescript-eslint/indent": "off",
    semi: "off",
    // TODO :: enable this on next release of eslint rules
    //"@swissquote/swissquote/@typescript-eslint/semi": "off",
    "no-extra-parens": "off",
    "@swissquote/swissquote/@typescript-eslint/no-extra-parens": "off",
    "@swissquote/swissquote/@typescript-eslint/member-delimiter-style": "off",
    "@swissquote/swissquote/@typescript-eslint/type-annotation-spacing": "off"
  }
};
