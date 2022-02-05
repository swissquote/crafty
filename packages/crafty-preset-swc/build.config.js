const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "swc-packages",
    externals: {
      // Provided by other Crafty packages
      ...getExternals(),

      "@swc/core": "@swc/core"
    }
  }
];
