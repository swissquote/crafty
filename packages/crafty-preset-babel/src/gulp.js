module.exports = function createTask(crafty, bundle, StreamHandler) {
  return cb => {
    // Init
    const stream = new StreamHandler(
      bundle.source,
      crafty.config.destination_js +
        (bundle.directory ? `/${bundle.directory}` : ""),
      cb,
      { sourcemaps: true },
      { sourcemaps: "." }
    );

    // Avoid compressing if it's already at the latest version
    if (crafty.isWatching()) {
      const newer = require("@swissquote/crafty-commons-gulp/packages/gulp-newer");
      stream.add(newer(crafty.config.destination_js + bundle.destination));
    }

    // Linting
    if (!crafty.isWatching()) {
      const {
        toTempFile,
        toolConfiguration
      } = require("@swissquote/crafty-preset-eslint/src/templates.js");
      const eslint = require("@swissquote/crafty-commons-gulp/packages/gulp-eslint-new");
      stream
        .add(
          eslint({
            configType: "flat",
            overrideConfigFile: toTempFile(toolConfiguration(crafty))
          })
        )
        .add(eslint.format())
        .add(
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
    if (bundle.concat) {
      const concat = require("@swissquote/crafty-commons-gulp/packages/gulp-concat");
      stream.add(concat(bundle.destination));
    }

    if (crafty.getEnvironment() === "production") {
      const terser = require("../packages/gulp-terser");
      stream.add(terser({ ...crafty.config.terser, sourceMap: {} }));
    }

    // Save
    return stream.generate();
  };
};
