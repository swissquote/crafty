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
      const newer = require("@swissquote/crafty-commons-gulp/packages/gulp-newer");
      stream.add(newer(crafty.config.destination_js + bundle.destination));
    }

    // Linting
    const {
      toTempFile
    } = require("@swissquote/crafty-preset-eslint/src/eslintConfigurator");
    const eslint = require("@swissquote/crafty-commons-gulp/packages/gulp-eslint-new");
    stream
      .add(
        eslint({
          overrideConfigFile: toTempFile(crafty.config.eslint)
        })
      )
      .add(eslint.format());

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

    const babel = require("../packages/gulp-babel");
    const babelConfigurator = require("@swissquote/babel-preset-swissquote/configurator-gulp");
    const babelOptions = babelConfigurator(crafty, bundle);

    stream.add(babel(babelOptions));

    // Process
    const sourcemaps = require("@swissquote/crafty-commons-gulp/packages/gulp-sourcemaps");
    stream.add(sourcemaps.init({ loadMaps: true }));

    if (bundle.concat) {
      const concat = require("@swissquote/crafty-commons-gulp/packages/gulp-concat");
      stream.add(concat(bundle.destination));
    }

    if (crafty.getEnvironment() === "production") {
      const terser = require("../packages/gulp-terser");
      stream.add(terser({ ...crafty.config.terser, sourceMap: {} }));
    }

    stream.add(sourcemaps.write("./"));

    // Save
    return stream.generate();
  };
};
