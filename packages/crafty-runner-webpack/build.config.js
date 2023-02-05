const { getExternals } = require("../../utils/externals");

const externals = getExternals();

module.exports = [
  builder =>
    builder("speed-measure-webpack-plugin")
      .package()
      .externals(externals),

  builder => builder("packages-webpack").externals(externals)
];
