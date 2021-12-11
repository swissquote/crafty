const fs = require("fs");
const path = require("path");

const externals = {
  "schema-utils": "schema-utils",
  postcss: "postcss",
  "/postcss\/lib(/.*)/": "postcss/lib$1",
  "@babel/code-frame": "@babel/code-frame",

  // Provided by other Crafty packages
  glob: "@swissquote/crafty-commons/packages/glob",
  debug: "@swissquote/crafty-commons/packages/debug",
  minimatch: "@swissquote/crafty-commons/packages/minimatch",
  micromatch: "@swissquote/crafty-commons/packages/micromatch",
  "plugin-error": "@swissquote/crafty-commons-gulp/packages/plugin-error",
  "fancy-log": "@swissquote/crafty/packages/fancy-log",
  "postcss-selector-parser": "@swissquote/stylelint-config-swissquote/packages/postcss-selector-parser",
  semver: "@swissquote/crafty-commons/packages/semver",
  "semver/functions/clean": "@swissquote/crafty-commons/packages/semver-clean",
  "semver/functions/parse": "@swissquote/crafty-commons/packages/semver-parse",
  "semver/functions/valid": "@swissquote/crafty-commons/packages/semver-valid",

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
