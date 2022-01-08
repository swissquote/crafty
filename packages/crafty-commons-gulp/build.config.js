const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "common-packages",
    externals: {
      // Provided by other Crafty packages
      ...getExternals(),

      // Get ESLint from crafty-preset-eslint
      eslint: "@swissquote/crafty-preset-eslint/packages/eslint",

      // "readable-stream" is a drop-in replacement of "stream"
      // But its current version is big and outdated
      "readable-stream": "stream"
    }
  }
];
