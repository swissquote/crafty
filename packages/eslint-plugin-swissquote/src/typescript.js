const { addMissingRules, warn } = require("./utils");

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
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      // use <root>/tsconfig.json
      typescript: {
        alwaysTryTypes: true // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
      }
    }
  },
  rules: {
    "@swissquote/swissquote/prettier/prettier": [
      warn(),
      { parser: "typescript" }
    ],

    // Has a TypeScript replacement
    "no-array-constructor": "off",
    "@swissquote/swissquote/@typescript-eslint/no-array-constructor": warn()
  }
};

// Disable all the rules from ESLint that are handled by @typescript-eslint
addMissingRules(
  require("../packages/typescript-eslint_eslint-plugin").configs[
    "eslint-recommended"
  ].overrides[0].rules,
  module.exports.rules
);

// Disable all the rules from @typescript-eslint that are handled by Prettier
addMissingRules(
  require("../packages/eslint-config-prettier").rules,
  module.exports.rules
);
