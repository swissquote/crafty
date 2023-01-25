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
