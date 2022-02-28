const { getExternals } = require("../../utils/externals");

module.exports = [
  builder =>
    builder("terser")
      .package()
      .externals({
        // Provided by other Crafty packages
        ...getExternals(),

        "@swc/core": "@swc/core"
      })
];
