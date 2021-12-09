const fs = require("fs");
const path = require("path");

const externals = {
  "schema-utils": "schema-utils",
  postcss: "postcss",
  "/postcss(/.*)": "postcss$1",
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
    externals: {
      ...externals,

      "@babel/code-frame": "@babel/code-frame",
    },
  },
  {
    name: "packages-gulp",
    externals: {
      ...externals,

      "plugin-error": "@swissquote/crafty-commons-gulp/packages/plugin-error",
      "fancy-log": "@swissquote/crafty/packages/fancy-log",
    },
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
