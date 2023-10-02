module.exports = {
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
    "import/resolver": {
      [require.resolve("../packages/eslint-import-resolver-node.js")]: {
        extensions: [".js", ".json"]
      }
    }
  },
  rules: {
    // -> Helpful warnings
    "@swissquote/swissquote/import/export": "error", // Report any invalid exports, i.e. re-export of the same name

    // -> Style guide
    // We only enable the rules that do a surface analysis,
    // all rules that require a deep analysis are very costly
    // and often fail with the module structure of crafty

    /**
     * Ensure all imports appear before other statements
     * We disable this rule because it can happen, usually in Jest tests that some calls are made before imports (jest.mock) that would fail if done after imports.
     * This works since the files are converted to commonjs before being run
     */
    //"@swissquote/swissquote/import/first": "warn",
    /**
     * Enforce a newline after import statements
     */
    "@swissquote/swissquote/import/newline-after-import": "error",
    "@swissquote/swissquote/import/no-absolute-path": "error",
    /**
     * Forbid Webpack loader syntax in imports.
     */
    "@swissquote/swissquote/import/no-webpack-loader-syntax": "error"
  }
};
