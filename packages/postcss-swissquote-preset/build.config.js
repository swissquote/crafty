const { getExternals } = require("../../utils/externals");

module.exports = [
  {
    name: "postcss-packages",
    externals: {
      // Provided by other Crafty package
      ...getExternals(),

      // Provided by this package
      "caniuse-lite": "caniuse-lite",
      "/caniuse-lite(/.*)/": "caniuse-lite$1",
      postcss: "postcss",
      "/postcss(/.*)/": "postcss$1",

      // postcss-url depends on make-dir
      // Since make-dir depends on semver that makes a big dependency
      // make-dir is also not that needed since we depend on Node 12 at least
      // This smaller version does reduces dependencies and is just enough to run
      "make-dir": "../../src/make-dir.js",

      // An optional embedded format we don't use
      "sugarss": "sugarss"
    }
  }
];
