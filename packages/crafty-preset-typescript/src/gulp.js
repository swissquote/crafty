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
    const {
      toTempFile
    } = require("@swissquote/crafty-preset-eslint/src/eslintConfigurator.js");
    const eslint = require("@swissquote/crafty-commons-gulp/packages/gulp-eslint-new.js");
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

    // Process

    // First convert TypeScript
    const tsOptions = {
      // Transpile to esnext so that SWC can apply all its magic
      target: "ESNext",
      // Preserve JSX so SWC can optimize it, or add development/debug information
      jsx: "Preserve"
    };
    const typescript = require("../packages/gulp-typescript");
    const tsProject = typescript.createProject("tsconfig.json", tsOptions);
    stream.add(tsProject());

    // Then finalize with SWC
    const swc = require("@swissquote/crafty-commons-swc/packages/gulp-swc.js");
    const {
      getConfigurationGulp
    } = require("@swissquote/crafty-commons-swc/src/configuration.js");
    const swcOptions = getConfigurationGulp(crafty, bundle);

    stream.add(swc(swcOptions));

    if (bundle.concat) {
      const concat = require("@swissquote/crafty-commons-gulp/packages/gulp-concat");
      stream.add(concat(bundle.destination));
    }

    // Save
    return stream.generate();
  };
};
