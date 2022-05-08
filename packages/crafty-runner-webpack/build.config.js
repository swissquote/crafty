const { getExternals } = require("../../utils/externals");

const externals = getExternals();

module.exports = [
  builder => builder("packages-webpack").externals(externals),
  builder => builder("webpack-plugin-serve/client").package(),
  builder =>
    builder("webpack-plugin-serve")
      .package()
      .externals({
        ...externals,
        webpack: "webpack",

        // since the server is only used to serve JS, we don't need to have these packages
        "webpack-plugin-ramdisk": "webpack-plugin-ramdisk",
        open: "open"
      })
];
