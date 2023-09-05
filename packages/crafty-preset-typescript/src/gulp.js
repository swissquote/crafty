const { finished } = require("node:stream/promises");
const { PassThrough } = require("node:stream");

function mergeStreams(...streams) {
  const combinedStream = new PassThrough({
    objectMode: true
  });

  Promise.all(
    streams.map(s => {
      s.on("error", e => {
        console.error("Bubbling error from stream", e);
        combinedStream.destroy(e);
      });

      return finished(s);
    })
  ).then(
    () => {
      combinedStream.end();
    },
    e => {
      combinedStream.destroy(e);
    }
  );

  return combinedStream;
}

module.exports = function createTask(crafty, bundle, gulp) {
  return cb => {
    const source = bundle.source;
    const destination =
      crafty.config.destination_js +
      (bundle.directory ? `/${bundle.directory}` : "");

    let stream = gulp.src(source, { sourcemaps: true });

    // Avoid compressing if it's already at the latest version
    if (crafty.isWatching()) {
      const newer = require("@swissquote/crafty-commons-gulp/packages/gulp-newer");
      stream = stream.pipe(newer(destination));
    }

    // Linting
    const {
      toTempFile
    } = require("@swissquote/crafty-preset-eslint/src/eslintConfigurator.js");
    const eslint = require("@swissquote/crafty-commons-gulp/packages/gulp-eslint-new.js");
    stream = stream
      .pipe(
        eslint({
          overrideConfigFile: toTempFile(crafty.config.eslint)
        })
      )
      .pipe(eslint.format());

    // Linting errors should not stop the watch mode
    if (!crafty.isWatching()) {
      stream = stream.pipe(
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

    // Transpilation

    // First convert TypeScript
    const tsOptions = {
      // Transpile to esnext so that SWC can apply all its magic
      target: "ESNext",
      // Preserve JSX so SWC can optimize it, or add development/debug information
      jsx: "Preserve"
    };
    const typescript = require("../packages/gulp-typescript");
    const tsProject = typescript.createProject("tsconfig.json", tsOptions);
    stream = stream.pipe(tsProject()).on("error", err => {
      crafty.error(err);
      cb(err);
    });

    // gulp-typescript exposes two separate streams for js and dts
    // this way we can compile only "ts" files and skip over ".d.ts"
    let jsStream = stream.js;
    const dtsStream = stream.dts;

    // Then finalize with SWC
    const swc = require("@swissquote/crafty-commons-swc/packages/gulp-swc.js");
    const {
      getConfigurationGulp
    } = require("@swissquote/crafty-commons-swc/src/configuration.js");
    const swcOptions = getConfigurationGulp(crafty, bundle);
    jsStream = jsStream.pipe(swc(swcOptions));

    if (bundle.concat) {
      const concat = require("@swissquote/crafty-commons-gulp/packages/gulp-concat");
      jsStream = jsStream.pipe(concat(bundle.destination));
    }

    // Save
    return mergeStreams(
      dtsStream.pipe(gulp.dest(destination)),
      jsStream.pipe(gulp.dest(destination, { sourcemaps: "." }))
    );
  };
};
