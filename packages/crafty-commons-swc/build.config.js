const { getExternals } = require("../../utils/externals");

module.exports = [
  builder =>
    builder("swc-packages")
      .packages(pkgBuilder =>
        pkgBuilder
          .package("@swc/jest", "swcJest")
          .package("swc-loader", "swcLoader")
      )
      .externals({
        // Provided by other Crafty packages
        ...getExternals(),

        "@swc/core": "@swc/core"
      })
];
