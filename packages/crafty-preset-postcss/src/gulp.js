const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const scssParser = require("postcss-scss");
const eos = require("end-of-stream");
const exhaust = require("stream-exhaust");
const getProcessors = require("@swissquote/postcss-swissquote-preset/processors");

function cssTask(crafty, StreamHandler, bundle) {
  return function() {
    // Init
    const destination =
      crafty.config.destination_css +
      (bundle.directory ? "/" + bundle.directory : "");

    return new StreamHandler(bundle.source, destination)
      .add(sourcemaps.init())
      .add(
        postcss(getProcessors(crafty.config), {
          parser: scssParser
        })
      )
      .add(rename(bundle.destination))
      .add(sourcemaps.write("./"))
      .generate();
  };
}

function createLinter(gulp, crafty, name) {
  gulp.task(name, function(cb) {
    const reporterConfig = {
      throwError: crafty.getEnvironment() === "production",
      clearReportedMessages: true
    };

    const reporter = require("./lint_reporter")(reporterConfig);

    const processors = [
      require("stylelint")(
        crafty.config.legacy_css
          ? crafty.config.stylelint_legacy
          : crafty.config.stylelint
      ),
      reporter
    ];

    const stream = gulp
      .src(crafty.config.stylelint_pattern)
      .pipe(postcss(processors, { parser: scssParser }));

    eos(exhaust(stream), { error: false }, err => {
      const result = reporter.report();

      if (err) {
        cb(err);
        return;
      }

      cb(
        result ? null : new crafty.Information("Stylelint: Errors were found")
      );
    });

    return stream;
  });
}

module.exports.createLinter = createLinter;
module.exports.createTask = cssTask;
