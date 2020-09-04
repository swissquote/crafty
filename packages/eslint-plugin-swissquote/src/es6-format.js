module.exports = {
  env: {
    es6: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  settings: {
    "import/extensions": [".js", ".jsx"],
    "import/ignore": [
      "node_modules",
      "\\.(coffee|scss|css|less|hbs|svg|json)$",
    ],
    "import/resolver": {
      node: {
        extensions: [".js", ".json"],
      },
    },
  },
  rules: {
    // -> Helpful warnings
    "@swissquote/swissquote/import/export": "error", // Report any invalid exports, i.e. re-export of the same name

    // -> Style guide
    // We only enable the rules that do a surface analysis,
    // all rules that require a deep analysis are very costly
    // and often fail with the module structure of crafty
    "@swissquote/swissquote/import/first": "error", // Ensure all imports appear before other statements
    "@swissquote/swissquote/import/newline-after-import": "error", // Enforce a newline after import statements
    "@swissquote/swissquote/import/no-absolute-path": "error",
    "@swissquote/swissquote/import/no-webpack-loader-syntax": "error", // Forbid Webpack loader syntax in imports.
  },
};
