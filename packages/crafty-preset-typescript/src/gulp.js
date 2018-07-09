const createTempFile = require("./utils").createTempFile;

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
    const tslint = require("gulp-tslint");
    stream.add(
      tslint({
        formatter: "stylish",
        configuration: createTempFile(JSON.stringify(crafty.config.tslint))
      })
    );

    // Fail the build if we have linting
    // errors and we build directly
    stream.add(
      tslint.report({
        emitError: !crafty.isWatching()
      })
    );

    // Process
    const sourcemaps = require("gulp-sourcemaps");
    stream.add(sourcemaps.init({ loadMaps: true }));

    const typescript = require("gulp-typescript");
    const tsProject = typescript.createProject("tsconfig.json");
    stream.add(tsProject());

    if (bundle.concat) {
      const concat = require("gulp-concat");
      stream.add(concat(bundle.destination));
    }

    stream.add(sourcemaps.write("./"));

    // Save
    return stream.generate();
  };
};
