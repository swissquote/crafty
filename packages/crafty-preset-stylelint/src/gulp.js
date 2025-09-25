import gulpStylelint from "../packages/gulp-stylelint.js";

import { createRequire } from "node:module";
import { createFormatter } from "./formatter.js";

const require = createRequire(import.meta.url);

export function createLinter(gulp, crafty, name) {
  gulp.task(name, () => {
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
        reporters: [{ formatter: createFormatter("stylelint"), console: true }]
      })
    );
  });
}
