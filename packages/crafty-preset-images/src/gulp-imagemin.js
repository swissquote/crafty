const path = require("path");
const PluginError = require("plugin-error");
const through = require("through2-concurrent");
const prettyBytes = require("pretty-bytes");
const colors = require("ansi-colors");
const { Worker } = require("jest-worker");
const {
  decodeBuffer,
  encodeJpeg,
  encodePng,
  encodeWebp
} = require("./squoosh/main");

function createWorker() {
  return new Worker(require.resolve("./squoosh/impl.js"), {
    enableWorkerThreads: true
  });
}

const nodeVersion = parseInt(process.version.replace("v", ""), 10);

const PLUGIN_NAME = "gulp-imagemin";

async function compress(worker, file, extension) {
  const bitmap = await decodeBuffer(worker, file.contents);

  const quality = 75;

  if (extension === ".webp") {
    return encodeWebp(worker, bitmap, { quality });
  }

  if (extension === ".png") {
    return encodePng(worker, bitmap);
  }

  if (extension === ".jpg" || extension === ".jpeg") {
    return encodeJpeg(worker, bitmap, { quality });
  }

  return file.contents;
}

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
      const savedMsg = `saved ${prettyBytes(saved)} - ${percent
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
        ` (saved ${prettyBytes(this.totalSavedBytes)} - ${percent
          .toFixed(1)
          .replace(/\.0$/, "")}%)`
      );
    }

    this.log(`${PLUGIN_NAME}:`, msg);
  }
}

module.exports = log => {
  const options = {
    // TODO: Remove this when Gulp gets a real logger with levels
    silent: process.argv.includes("--silent"),
    verbose: process.argv.includes("--verbose")
  };

  const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const reporter = new Reporter(options, log);

  let worker;

  let loggedOldNodeMessage = false;

  function endWorker() {
    if (worker && worker.end) {
      worker.end();
      worker = null;
    }
  }

  return through.obj(
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

      if (nodeVersion <= 10) {
        if (!loggedOldNodeMessage && !options.silent) {
          log(
            `${PLUGIN_NAME}: Skipping image compression using WebAssembly as your node version doesn't support it.`
          );
          loggedOldNodeMessage = true;
        }

        callback(null, file);
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
          if (!worker) {
            worker = await createWorker();
          }

          const optimizedBuffer = await compress(worker, file, extension);

          reporter.addFile(
            file.contents.length,
            optimizedBuffer.length,
            file.relative
          );

          file.contents = optimizedBuffer;

          callback(null, file);
        } catch (error) {
          // End the worker in case of error as the stream will be interrupted
          endWorker();
          callback(
            new PluginError(PLUGIN_NAME, error, { fileName: file.path })
          );
        }
      })();
    },
    callback => {
      // Once all images are compressed, we end the worker
      endWorker();

      reporter.report();

      callback();
    }
  );
};
