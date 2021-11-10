const { PassThrough } = require("stream");

/**
 * I'm not sure I know what I'm doing ...
 * But the idea is :
 * - Create an outer stream that will be left untouched,
 * - An inner stream with SWC
 * - When an error is thrown by SWC, capture, transform and send it to the outer stream
 *
 * A lot of time has been lost here, if you know a better way please contribute :)
 */
function swcWrapper(crafty, swcTransform) {
  const outerStream = new PassThrough({
    bubbleErrors: true,
    objectMode: true
  });

  const innerStream = new PassThrough({
    bubbleErrors: true,
    objectMode: true
  }).pipe(swcTransform);

  innerStream.on("error", error => {
    // Reporting this error seems to make it loop
    // Here we're making sure it doesn't happen
    if (!error.fileName) {
      console.log("This is a loop");
      return;
    }

    const message = `${error.fileName}: ${error.message
      .replace(/\n+Caused by:\n(?: {4}([0-9]+):.*$\n?)+/gm, "")
      .replace(/^(Error: )+/i, "")}`;

    outerStream.emit("error", new crafty.Information(message));
  });

  return outerStream.pipe(innerStream);
}

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
    const eslint = require("gulp-eslint-new");
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

    const swc = require("gulp-swc");
    const { getConfigurationGulp } = require("./configuration.js");
    const swcOptions = getConfigurationGulp(crafty, bundle);

    stream.add(swcWrapper(crafty, swc(swcOptions, bundle)));

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
