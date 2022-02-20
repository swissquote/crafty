const { getExternals } = require("../../utils/externals");

module.exports = [
  builder => builder("swc-packages").externals({
    // Provided by other Crafty packages
    ...getExternals(),

    "@swc/core": "@swc/core"
  })
];
