import gulpStylelint from "../packages/gulp-stylelint.js";
import scss from "postcss-scss";

export function createLinter(gulp, crafty, name) {
  gulp.task(name, () => {
    const config = {
      ...(crafty.config.legacy_css
        ? crafty.config.stylelint_legacy
        : crafty.config.stylelint)
    };

    config.customSyntax = scss;

    return gulp.src(crafty.config.stylelint_pattern).pipe(
      gulpStylelint({
        config,
        failAfterError: crafty.getEnvironment() === "production",
        reporters: [{ formatter: "string", console: true }]
      })
    );
  });
}
