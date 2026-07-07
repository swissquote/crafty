import { spawnSync } from "node:child_process";
import { resolveOxlintBin } from "./utils.js";

const PLUGIN_NAME = "OxlintCheckPlugin";

/**
 * webpack/rspack plugin that runs oxlint during the build and fails it on lint
 * errors. This mirrors the eslint preset's build-time linting (which used the
 * eslint-webpack-plugin), but runs the oxlint binary directly — the same
 * spawn-based approach as OxfmtCheckPlugin — so there is no extra plugin
 * dependency to keep the bundler's event loop alive.
 *
 * It is only registered on non-watch builds (see the preset's webpack/rspack
 * hooks). oxlint exits with a non-zero status when it finds errors (warnings
 * alone do not fail the build).
 */
export default class OxlintCheckPlugin {
  constructor(options = {}) {
    this.config = options.config;
    this.includes = options.includes || ["."];
  }

  apply(compiler) {
    compiler.hooks.afterCompile.tapAsync(
      PLUGIN_NAME,
      (compilation, callback) => {
        const args = [];
        if (this.config) {
          args.push("--config", this.config);
        }
        args.push(...this.includes);

        const result = spawnSync(
          process.execPath,
          [resolveOxlintBin(), ...args],
          {
            encoding: "utf-8"
          }
        );

        if (result.status !== 0) {
          const output = `${result.stdout || ""}${result.stderr || ""}`.trim();
          compilation.errors.push(
            new Error(`oxlint found problems:\n${output}`)
          );
        }

        callback();
      }
    );
  }
};
