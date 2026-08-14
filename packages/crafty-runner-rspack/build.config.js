const { getExternals } = require("../../utils/externals");

const externals = getExternals();

module.exports = [
  builder =>
    builder("common-ancestor-path")
      .esm()
      .package({ names: ["commonAncestorPath"] }),
  builder =>
    builder("packages-rspack")
      .packages(pkgBuilder => {
        pkgBuilder
          .package("glob-to-regexp", "globToRegexp")
          .package("hash-index", "hashIndex")
          .package("is-glob", "isGlob")
          .package("rspack-chain", "rspackChain")
          .package("webpack-merge", "webpackMerge");
      })
      .externals(externals)
];
