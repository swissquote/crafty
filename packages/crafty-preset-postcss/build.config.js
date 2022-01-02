const fs = require("fs");
const path = require("path");

const { getExternals } = require("../../utils/externals");

const externals = {
  // Provided by other Crafty packages
  ...getExternals(),

  "schema-utils": "schema-utils",
  postcss: "postcss",
  "postcss/package.json": "postcss/package.json",
  "/postcss\/lib(/.*)/": "postcss/lib$1",
  "@babel/code-frame": "@babel/code-frame",

  // Provide a simplified package data normalizer
  "normalize-package-data": "../../packages/normalize-package-data.js",

  // Not used as we pass the configuration directly, can be excluded from the bundle
  "postcss-load-config": "../../src/dummy.js",
  "cosmiconfig": "../../src/dummy.js"
};

/**
 * Look ma, it's cp -R.
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
var copyRecursiveSync = function(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

module.exports = [
  {
    name: "packages-webpack",
    externals,
  },
  {
    name: "packages-gulp",
    externals,
  },
  async function() {
    console.log("Copying style-loader/dist/runtime to dist/compiled/runtime");
    const styleLoaderFolder = path.dirname(
      require.resolve("style-loader/package.json")
    );

    copyRecursiveSync(
      path.join(styleLoaderFolder, "dist", "runtime"),
      path.join(__dirname, "dist", "compiled", "runtime")
    );
  },
];
