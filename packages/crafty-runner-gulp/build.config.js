const { getExternals } = require("../../utils/externals");

module.exports = [
  (builder) =>
    builder("gulp-packages")
      .packages((pkgBuilder) =>
        pkgBuilder
          .package("@onigoetz/stream-plumber", "gulpPlumber")
          .package("pump", "pump")
      )
      .externals(getExternals()),
];
