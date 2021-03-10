const path = require("path");
const PluginError = require("plugin-error");
const through = require("through2-concurrent");
const prettyBytes = require("pretty-bytes");
const colors = require("ansi-colors");
const JestWorker = require("jest-worker").default;
const {
  decodeBuffer,
  encodeJpeg,
  encodePng,
  encodeWebp
} = require("./squoosh/main");

function createWorker() {
  return new JestWorker(require.resolve("./squoosh/impl.js"), {
    enableWorkerThreads: true
  });
}

const nodeVersion = parseInt(process.version.replace("v", ""));

const PLUGIN_NAME = "gulp-imagemin";

async function compress(worker, file, extension) {
  const bitmap = await decodeBuffer(worker, file.contents);

  const quality = 75;

  let optimizedBuffer;
  if (extension === ".webp") {
    optimizedBuffer = await encodeWebp(worker, bitmap, { quality });
  } else if (extension === ".png") {
    optimizedBuffer = await encodePng(worker, bitmap);
  } else if (extension === ".jpg" || extension === ".jpeg") {
    optimizedBuffer = await encodeJpeg(worker, bitmap, { quality });
  }

  const data = optimizedBuffer;
  const originalSize = file.contents.length;
  const optimizedSize = data.length;
  const saved = originalSize - optimizedSize;
  const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
  const savedMsg = `saved ${prettyBytes(saved)} - ${percent
    .toFixed(1)
    .replace(/\.0$/, "")}%`;
  const msg = saved > 0 ? savedMsg : "already optimized";

  return {
    originalSize,
    saved,
    data,
    msg
  };
}

module.exports = log => {
  const options = {
    // TODO: Remove this when Gulp gets a real logger with levels
    silent: process.argv.includes("--silent"),
    verbose: process.argv.includes("--verbose")
  };

  const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  let totalBytes = 0;
  let totalSavedBytes = 0;
  let totalFiles = 0;

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

          const { originalSize, saved, data, msg } = await compress(
            worker,
            file,
            extension
          );

          if (saved > 0) {
            totalBytes += originalSize;
            totalSavedBytes += saved;
            totalFiles++;
          }

          if (options.verbose) {
            log(
              `${PLUGIN_NAME}:`,
              colors.green("✔ ") + file.relative + colors.gray(` (${msg})`)
            );
          }

          file.contents = data;
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

      if (!options.silent) {
        const percent =
          totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
        let msg = `Minified ${totalFiles} ${
          totalFiles === 1 ? "image" : "images"
        }`;

        if (totalFiles > 0) {
          msg += colors.gray(
            ` (saved ${prettyBytes(totalSavedBytes)} - ${percent
              .toFixed(1)
              .replace(/\.0$/, "")}%)`
          );
        }

        log(`${PLUGIN_NAME}:`, msg);
      }

      callback();
    }
  );
};
