import path from "node:path";
import { readFile } from "node:fs/promises";

const PLUGIN_NAME = "OxfmtCheckPlugin";

// Source extensions oxfmt can format. CSS/SCSS are intentionally excluded:
// stylelint handles those.
const FORMATTABLE = new Set([
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".ts",
  ".tsx",
  ".mts",
  ".cts"
]);

/**
 * webpack/rspack plugin that checks formatting during the build and fails it
 * when files are not formatted.
 *
 * Unlike the standalone `crafty oxfmt` command (which spawns the oxfmt CLI),
 * this runs in-process through oxfmt's `format()` JS API: there is no
 * per-build process spawn, and only the source files that took part in the
 * compilation are checked (the same spirit as eslint-webpack-plugin).
 *
 * This preserves the behavior of the eslint+prettier preset, where the build
 * fails on badly formatted code (there, formatting was enforced through the
 * `prettier/prettier` ESLint rule). oxlint does not format, so formatting is
 * enforced here instead.
 *
 * It is only registered on non-watch builds (see the preset's webpack/rspack
 * hooks), so the one-shot check runs once per build.
 */
export default class OxfmtCheckPlugin {
  constructor(options = {}) {
    this.options = options.config || {};
    this.cwd = process.cwd();
  }

  apply(compiler) {
    compiler.hooks.afterCompile.tapAsync(
      PLUGIN_NAME,
      (compilation, callback) => {
        this.check(compilation)
          .then(() => callback())
          .catch(callback);
      }
    );
  }

  /**
   * Collect the project source files that took part in the compilation,
   * excluding dependencies and build output.
   */
  collectFiles(compilation) {
    const files = new Set();
    for (const file of compilation.fileDependencies || []) {
      if (typeof file !== "string" || !path.isAbsolute(file)) {
        continue;
      }
      if (!file.startsWith(this.cwd)) {
        continue;
      }
      if (file.includes(`${path.sep}node_modules${path.sep}`)) {
        continue;
      }
      if (!FORMATTABLE.has(path.extname(file))) {
        continue;
      }
      files.add(file);
    }
    return [...files];
  }

  async check(compilation) {
    const { format } = await import("oxfmt");
    const files = this.collectFiles(compilation);

    const unformatted = [];
    await Promise.all(
      files.map(async file => {
        const source = await readFile(file, "utf8");
        const result = await format(file, source, this.options);
        if (result.errors?.length || result.code !== source) {
          unformatted.push(path.relative(this.cwd, file));
        }
      })
    );

    if (unformatted.length > 0) {
      unformatted.sort();
      compilation.errors.push(
        new Error(
          `oxfmt found unformatted files. Run \`crafty oxfmt\` to fix them.\n${unformatted
            .map(file => `  ${file}`)
            .join("\n")}`
        )
      );
    }
  }
}
