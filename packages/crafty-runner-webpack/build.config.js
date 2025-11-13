const fs = require("node:fs/promises");
const path = require("node:path");

const { getExternals } = require("../../utils/externals");

const externals = getExternals();

module.exports = [
  (builder) =>
    builder("speed-measure-webpack-plugin").package().externals(externals),
  (builder) =>
    builder("packages-webpack")
      .packages((pkgBuilder) => {
        pkgBuilder
          .package(
            "case-sensitive-paths-webpack-plugin",
            "caseSensitivePathsWebpackPlugin"
          )
          .package("glob-to-regexp", "globToRegexp")
          .package("hash-index", "hashIndex")
          .package("inspectpack/plugin", "inspectpack")
          .package("is-glob", "isGlob")
          .package("webpack-chain-5", "webpackChain")
          .package("webpack-merge", "webpackMerge");
      })
      .externals(externals),
  async () => {
    console.log("Patching dist/packages-webpack/bundled.js");
    const bundled = path.join(
      __dirname,
      "dist",
      "packages-webpack",
      "bundled.js"
    );
    const content = await fs.readFile(bundled, { encoding: "utf-8" });
    await fs.writeFile(
      bundled,
      content.replace(
        /plugin = __nccwpck_require__\(.*?\)\(pluginPath\);/,
        "plugin = require(pluginPath);"
      )
    );
  },
];
