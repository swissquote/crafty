const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "swc-packages",
    externals: {
      // Provided by other Crafty packages
      ...getExternals(),

      "@swc/core": "@swc/core",

      // "readable-stream" is a drop-in replacement of "stream"
      // But its current version is big and outdated
      "readable-stream": "stream"
    }
  }
];
