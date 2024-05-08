const path = require("path");

const { getExternals } = require("../../utils/externals");
const { copyRecursiveSync } = require( "../../utils/functions.js");

const singlePackages = [
  "gulp-postcss",
  "gulp-rename",
  "resolve-from",
];

const externals = {
  // Provided by other Crafty packages
  ...getExternals(),

  ...Object.fromEntries(
    singlePackages.map((pkg) => [pkg, `../${pkg}/index.js`])
  ),

  "schema-utils": "schema-utils",
  postcss: "postcss",
  "postcss/package.json": "postcss/package.json",
  "/postcss/lib(/.*)/": "postcss/lib$1",
  "@babel/code-frame": "@babel/code-frame",
  "postcss-load-config": "../../src/dummy.js",
};

module.exports = [
  ...singlePackages.map((pkg) => {
    const newExternals = { ...externals };
    delete newExternals[pkg];

    return (builder) =>
      builder(pkg)
        .package()
        .externals(newExternals);
  }),
  (builder) => builder("loaders")
    .packages(pkgBuilder => {
      pkgBuilder
        .package("css-loader", "cssLoader")
        .package("postcss-loader", "postcssLoader")
        .package("style-loader", "styleLoader")
    })
    .externals(externals),
  async function() {
    console.log("Copying style-loader/dist/runtime to dist/loaders/runtime");
    const styleLoaderFolder = path.dirname(
      require.resolve("style-loader/package.json")
    );

    copyRecursiveSync(
      path.join(styleLoaderFolder, "dist", "runtime"),
      path.join(__dirname, "dist", "loaders", "runtime")
    );
  },
];
