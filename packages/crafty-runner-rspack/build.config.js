const fs = require("node:fs/promises");
const path = require("node:path");
const { getExternals } = require("../../utils/externals");

const externals = getExternals();

module.exports = [
  builder =>
    builder("packages-rspack")
      .packages(pkgBuilder => {
        pkgBuilder
          .package("glob-to-regexp", "globToRegexp")
          .package("hash-index", "hashIndex")
          .package("is-glob", "isGlob")
          .package("rspack-chain", "rspackChain")
          .package("webpack-merge", "webpackMerge")
          .package("common-ancestor-path", "commonAncestorPath");
      })
      .externals(externals),
  async () => {
    console.log("Patching dist/packages-rspack/bundled.js");
    const bundled = path.join(
      __dirname,
      "dist",
      "packages-rspack",
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
  }
];
