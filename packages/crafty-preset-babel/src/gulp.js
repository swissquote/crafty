const concat = require("gulp-concat");
const eslint = require("gulp-eslint");
const newer = require("gulp-newer");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");

const babelConfigurator = require("./babel");

module.exports = function createTask(crafty, bundle, StreamHandler) {
  return cb => {
    // Init
    const stream = new StreamHandler(
      bundle.source,
      crafty.config.destination_js +
        (bundle.directory ? "/" + bundle.directory : ""),
      cb
    );

    // Avoid compressing if it's already at the latest version
    if (crafty.isWatching()) {
      stream.add(newer(crafty.config.destination_js + bundle.destination));
    }

    // Linting
    stream.add(eslint(crafty.config.eslint)).add(eslint.format());

    // Fail the build if we have linting
    // errors and we build directly
    if (!crafty.isWatching()) {
      stream.add(
        eslint.results(results => {
          const count = results.errorCount;
          if (count) {
            const message =
              "ESLint failed with " +
              count +
              (count === 1 ? " error" : " errors");
            cb(new crafty.Information(message));
          }
        })
      );
    }

    const babelOptions = babelConfigurator(
      crafty,
      crafty.getEnvironment() === "production" ? "production" : "development",
      bundle
    );

    stream.add(babel(babelOptions));

    // Process
    stream.add(sourcemaps.init({ loadMaps: true }));

    if (bundle.concat) {
      stream.add(concat(bundle.destination));
    }

    if (crafty.getEnvironment() === "production") {
      stream.add(uglify(crafty.config.uglifyJS));
    }

    stream.add(sourcemaps.write("./"));

    // Save
    return stream.generate();
  };
};
