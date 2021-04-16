module.exports = function createTask(crafty, bundle, StreamHandler) {
  return cb => {
    // Init
    const stream = new StreamHandler(
      bundle.source,
      crafty.config.destination_js +
        (bundle.directory ? `/${bundle.directory}` : ""),
      cb
    );

    // Avoid compressing if it's already at the latest version
    if (crafty.isWatching()) {
      const newer = require("gulp-newer");
      stream.add(newer(crafty.config.destination_js + bundle.destination));
    }

    // Linting
    const {
      toTempFile
    } = require("@swissquote/crafty-preset-eslint/src/eslintConfigurator");
    const eslint = require("gulp-eslint7");
    stream.add(eslint(toTempFile(crafty.config.eslint))).add(eslint.format());

    // Fail the build if we have linting
    // errors and we build directly
    if (!crafty.isWatching()) {
      stream.add(
        eslint.results(results => {
          const count = results.errorCount;
          if (count) {
            const message = `ESLint failed with ${count}${
              count === 1 ? " error" : " errors"
            }`;
            cb(new crafty.Information(message));
          }
        })
      );
    }

    const swc = require("gulp-swc");
    const { getConfigurationGulp } = require("./configuration.js");
    const swcOptions = getConfigurationGulp(crafty, bundle);

    stream.add(swc(swcOptions, bundle));

    // Process
    const sourcemaps = require("gulp-sourcemaps");
    stream.add(sourcemaps.init({ loadMaps: true }));

    if (bundle.concat) {
      const concat = require("gulp-concat");
      stream.add(concat(bundle.destination));
    }

    if (crafty.getEnvironment() === "production") {
      const terser = require("gulp-terser");
      stream.add(terser({ ...crafty.config.terser, sourceMap: {} }));
    }

    stream.add(sourcemaps.write("./"));

    // Save
    return stream.generate();
  };
};
