import path from "path";
import PluginError from "plugin-error";
import colors from "ansi-colors";
import { optimizeImage } from "@onigoetz/resquoosh";

import concurrent from "./concurrent.js";

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1000;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${sizes[i]}`;
}

const PLUGIN_NAME = "gulp-imagemin";

class Reporter {
  constructor(options, log) {
    this.options = options;
    this.log = log;

    this.totalBytes = 0;
    this.totalSavedBytes = 0;
    this.totalFiles = 0;
  }

  addFile(originalSize, optimizedSize, name) {
    const saved = originalSize - optimizedSize;

    if (saved > 0) {
      this.totalBytes += originalSize;
      this.totalSavedBytes += saved;
      this.totalFiles++;
    }

    if (this.options.verbose) {
      const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
      const savedMsg = `saved ${formatBytes(saved)} - ${percent
        .toFixed(1)
        .replace(/\.0$/, "")}%`;
      const msg = saved > 0 ? savedMsg : "already optimized";

      this.log(
        `${PLUGIN_NAME}:`,
        colors.green("✔ ") + name + colors.gray(` (${msg})`)
      );
    }
  }

  report() {
    if (this.options.silent) {
      return;
    }

    const percent =
      this.totalBytes > 0 ? (this.totalSavedBytes / this.totalBytes) * 100 : 0;
    let msg = `Minified ${this.totalFiles} ${
      this.totalFiles === 1 ? "image" : "images"
    }`;

    if (this.totalFiles > 0) {
      msg += colors.gray(
        ` (saved ${formatBytes(this.totalSavedBytes)} - ${percent
          .toFixed(1)
          .replace(/\.0$/, "")}%)`
      );
    }

    this.log(`${PLUGIN_NAME}:`, msg);
  }
}

export default log => {
  const options = {
    // TODO: Remove this when Gulp gets a real logger with levels
    silent: process.argv.includes("--silent"),
    verbose: process.argv.includes("--verbose")
  };

  const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const reporter = new Reporter(options, log);

  return concurrent(
    {
      maxConcurrency: 8
    },
    (file, encoding, callback) => {
      if (file.isNull()) {
        callback(null, file);
        return;
      }

      if (file.isStream()) {
        callback(new PluginError(PLUGIN_NAME, "Streaming not supported"));
        return;
      }

      const extension = path.extname(file.path).toLowerCase();

      if (!validExtensions.includes(extension)) {
        if (options.verbose) {
          log(
            `${PLUGIN_NAME}: Skipping unsupported image ${colors.blue(
              file.relative
            )}`
          );
        }

        callback(null, file);
        return;
      }

      (async () => {
        try {
          const optimizedBuffer = await optimizeImage(file.contents);

          reporter.addFile(
            file.contents.length,
            optimizedBuffer.length,
            file.relative
          );

          file.contents = optimizedBuffer;

          callback(null, file);
        } catch (error) {
          callback(
            new PluginError(PLUGIN_NAME, error, { fileName: file.path })
          );
        }
      })();
    },
    callback => {
      try {
        reporter.report();
        callback();
      } catch (e) {
        callback(e);
      }
    }
  );
};
