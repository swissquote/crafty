const { getExternals } = require("../../utils/externals");

const externals = getExternals();

module.exports = [
  builder =>
    builder("json5")
      .package()
      .externals(externals),
  builder =>
    builder("uri-js")
      .package()
      .externals(externals),
  builder => builder("big.js").package(),
  builder =>
    builder("loader-utils")
      .package()
      .externals({
        ...externals,
        json5: "../json5/index.js",
        "big.js": "../big.js/index.js"
      })
];
