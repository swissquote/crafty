const { getExternals } = require("../../utils/externals");

module.exports = [
  (builder) =>
    builder("gulp-packages")
      .packages((pkgBuilder) =>
        pkgBuilder
          .package("@swissquote/gulp-plumber", "gulpPlumber")
          .package("pump", "pump")
      )
      .externals(getExternals()),
];
