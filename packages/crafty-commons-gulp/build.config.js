const { getExternals } = require("../../utils/externals");

const externals = getExternals();

// "readable-stream" is a drop-in replacement of "stream"
// But its current version is big and outdated
externals["readable-stream"] = "stream";

module.exports = [
  builder => builder("vinyl-sourcemaps-apply").package(),
  builder =>
    builder("vinyl")
      .packages(pkgBuilder =>
        pkgBuilder
          .package("duplexify", "duplexify", `dist/vinyl/duplexify.js`)
          .package("vinyl", "vinyl", `dist/vinyl/vinyl.js`)
          .package("vinyl-fs", "vinylFs", `dist/vinyl/vinyl-fs.js`)
          .package("graceful-fs", "gracefulFs", `dist/vinyl/graceful-fs.js`)
          .package("inherits", "inherits", `dist/vinyl/inherits.js`)
      )
      .externals(externals),
  builder =>
    builder("common-packages")
      .packages(pkgBuilder =>
        pkgBuilder
          .package("gulp-concat", "gulpConcat")
          .package("gulp-eslint-new", "gulpEslintNew")
          .package("@swissquote/gulp-newer", "gulpNewer")
          .package("plugin-error", "pluginError")
      )
      .externals({
        // Provided by other Crafty packages
        ...externals,

        duplexify: "../vinyl/duplexify.js",
        "graceful-fs": "../vinyl/graceful-fs.js",
        vinyl: "../vinyl/vinyl.js",
        inherits: "../vinyl/inherits.js",
        "vinyl-fs": "../vinyl/vinyl-fs.js",

        // Get ESLint from crafty-preset-eslint
        eslint: "@swissquote/crafty-preset-eslint/packages/eslint",
        "eslint/use-at-your-own-risk":
          "@swissquote/crafty-preset-eslint/packages/eslint-at-your-own-risk"
      })
];
