const { warn } = require("./utils");

// EcmaScript 6 specific configuration
module.exports = {
  files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
  languageOptions: {
    parser: require("../packages/typescript-eslint_parser.js")
  },

  /*parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },

    // TODO: Figure out what's needed to get this to work properly
    // project: true


    // typescript-eslint specific options
    //warnOnUnsupportedTypeScriptVersion: true
  },*/
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".mts", ".cts"]
    },
    "import/resolver": {
      // use <root>/tsconfig.json
      [require.resolve("../packages/eslint-import-resolver-typescript.js")]: {
        alwaysTryTypes: true // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
      }
    }
  },
  rules: {
    // Disable all the rules from @typescript-eslint that are handled by Prettier
    ...require("../packages/eslint-config-prettier").rules,

    // Disable all the rules from ESLint that are handled by @typescript-eslint
    ...require("../packages/typescript-eslint.js").configs.eslintRecommended
      .rules,

    "prettier/prettier": [warn(), { parser: "typescript" }],

    // Has a TypeScript replacement
    "no-array-constructor": "off",
    "@typescript-eslint/no-array-constructor": warn()
  },
  plugins: {
    "@typescript-eslint": require("../packages/typescript-eslint.js").plugin
  }
};
