const concat = require("gulp-concat");
const tslint = require("gulp-tslint");
const newer = require("gulp-newer");
const sourcemaps = require("gulp-sourcemaps");
const typescript = require("gulp-typescript");

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
      stream.add(newer(crafty.config.destination_js + bundle.destination));
    }

    // Linting
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
    stream.add(sourcemaps.init({ loadMaps: true }));

    const tsProject = typescript.createProject("tsconfig.json");
    stream.add(tsProject());

    if (bundle.concat) {
      stream.add(concat(bundle.destination));
    }

    stream.add(sourcemaps.write("./"));

    // Save
    return stream.generate();
  };
};
