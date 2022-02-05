const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    package: "through2",
    externals: {
      // "readable-stream" is a drop-in replacement of "stream"
      // But its current version is big and outdated
      "readable-stream": "stream"
    }
  },
  {
    name: "common-packages",
    externals: {
      // Provided by other Crafty packages
      ...getExternals(),

      through2: "../through2/index.js",

      // Get ESLint from crafty-preset-eslint
      eslint: "@swissquote/crafty-preset-eslint/packages/eslint"
    }
  }
];
