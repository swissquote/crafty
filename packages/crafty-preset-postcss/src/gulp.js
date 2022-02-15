function cssTask(crafty, StreamHandler, bundle) {
  return function(cb) {
    // Init
    const destination =
      crafty.config.destination_css +
      (bundle.directory ? `/${bundle.directory}` : "");

    const getProcessors = require("@swissquote/postcss-swissquote-preset/processors");
    const postcss = require("../packages/gulp-postcss.js");
    const rename = require("../packages/gulp-rename.js");
    const scssParser = require("postcss-scss");
    const touch = require("./touch.js");

    return new StreamHandler(
      bundle.source,
      destination,
      cb,
      { sourcemaps: true },
      { sourcemaps: "." }
    )
      .add(
        postcss(getProcessors(crafty.config, crafty, bundle), {
          parser: scssParser
        })
      )
      .add(rename(bundle.destination))
      .add(touch())
      .generate();
  };
}

function createLinter(gulp, crafty, name) {
  gulp.task(name, () => {
    const gulpStylelint = require("../packages/gulp-stylelint.js");

    const config = {
      ...(crafty.config.legacy_css
        ? crafty.config.stylelint_legacy
        : crafty.config.stylelint)
    };

    config.customSyntax = require("postcss-scss");

    return gulp.src(crafty.config.stylelint_pattern).pipe(
      gulpStylelint({
        config,
        failAfterError: crafty.getEnvironment() === "production",
        reporters: [{ formatter: "string", console: true }]
      })
    );
  });
}

module.exports.createLinter = createLinter;
module.exports.createTask = cssTask;
