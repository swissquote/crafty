module.exports = [
  {
    name: "postcss-packages",
    externals: {
      assets: "assets",
      browserslist: "browserslist",
      "caniuse-lite": "caniuse-lite", // caniuse-lite will still be imported by autoprefixer
      "postcss-assets": "postcss-assets", // Depends on "assets" in a way that doesn't compile

      // TODO :: add a check to make sure no other direct imports are added
      postcss: "postcss",
      "postcss/lib/container": "postcss/lib/container",
      "postcss/lib/input": "postcss/lib/input",
      "postcss/lib/parser": "postcss/lib/parser",
      "postcss/lib/node": "postcss/lib/node",
      "postcss/lib/comment": "postcss/lib/comment",
      "postcss/lib/list": "postcss/lib/list",
      "postcss/lib/tokenize": "postcss/lib/tokenize",
      "postcss/lib/stringifier": "postcss/lib/stringifier",

      // postcss-url depends on make-dir
      // Since make-dir depends on semver that makes a big dependency
      // make-dir is also not that needed since we depend on Node 12 at least
      // This smaller version does reduces dependencies and is just enough to run
      "make-dir": "../../src/make-dir.js"
    }
  }
];
