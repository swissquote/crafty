// EcmaScript 6 specific configuration
module.exports = {
  //plugins: [
  //    require.resolve("eslint-plugin-import")
  //],
  env: {
    es6: true
  },
  parserOptions: {
    sourceType: "module"
  },
  settings: {
    "import/extensions": [".js", ".jsx"],
    "import/ignore": [
      "node_modules",
      "\\.(coffee|scss|css|less|hbs|svg|json)$"
    ],
    "import/parsers": {
      "typescript-eslint-parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".json"]
      }
    }
  },
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

    // Import rules
    "no-useless-rename": "error",

    // -> Static Analysis

    //"@swissquote/swissquote/import/no-unresolved": "error", // Ensure imports point to a file/module that can be resolved.
    "@swissquote/swissquote/import/default": "warn", // Ensure a default export is present, given a default import.
    "@swissquote/swissquote/import/named": "warn", // Ensure named imports correspond to a named export in the remote file.

    // -> Helpful warnings
    "@swissquote/swissquote/import/export": "error", // Report any invalid exports, i.e. re-export of the same name
    "@swissquote/swissquote/import/no-deprecated": "warn", // Report imported names marked with @deprecated documentation tag

    // -> Style guide
    "@swissquote/swissquote/import/first": "error", // Ensure all imports appear before other statements
    "@swissquote/swissquote/import/no-duplicates": "error", // Report repeated import of the same module in multiple places
    //"@swissquote/swissquote/import/newline-after-import": "error", // Enforce a newline after import statements
    "@swissquote/swissquote/import/order": [
      "error",
      {
        // Enforce a convention in module import order
        groups: [
          "builtin",
          "external",
          ["index", "sibling", "parent", "internal"]
        ],
        "newlines-between": "always"
      }
    ],
    "@swissquote/swissquote/import/newline-after-import": "error",
    "@swissquote/swissquote/import/prefer-default-export": "error",
    "@swissquote/swissquote/import/no-absolute-path": "error",
    "@swissquote/swissquote/import/no-webpack-loader-syntax": "error" // Forbid Webpack loader syntax in imports.
  }
};
