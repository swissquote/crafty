const fs = require("fs");
const path = require("path");

const { getExternals } = require("../../utils/externals");

const externals = {
  // Provided by other Crafty packages
  ...getExternals(),

  //"webpack": "webpack",
  "webpack-sources": "../../src/webpack-sources",
  "webpack/lib/ModuleFilenameHelpers": "../../src/ModuleFilenameHelpers.js",

  lightningcss: "lightningcss"
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
  builder =>
  builder("webpack-packages")
    .packages(pkgBuilder =>
      pkgBuilder
        .package("css-loader", "cssLoader")
        .package("style-loader", "styleLoader")
        .package("lightningcss-loader", "lightningcssLoader")
    )
    .externals(externals),
  async function() {

    console.log("Patching dist/webpack-packages/bundled.js");
    const bundled = path.join(__dirname, "dist", "webpack-packages", "bundled.js");
    const content = await fs.promises.readFile(bundled, { encoding: "utf-8" });
    await fs.promises.writeFile(bundled, content.replace("../package.json", "../../package.json"));

    console.log("Copying style-loader/webpack-packages/runtime to dist/webpack-packages/runtime");
    const styleLoaderFolder = path.dirname(
      require.resolve("style-loader/package.json")
    );

    copyRecursiveSync(
      path.join(styleLoaderFolder, "dist", "runtime"),
      path.join(__dirname, "dist", "webpack-packages", "runtime")
    );
  },
];
