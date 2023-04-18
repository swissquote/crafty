// This is a fork of https://github.com/konclave/gulp-swc version 1.2.3
// This version adds
// - cleanup of error messages
// - ignore .d.ts files

const swc = require("@swc/core");
const path = require("path");
const { Transform } = require("stream");
const PluginError = require("@swissquote/crafty-commons-gulp/packages/plugin-error.js");
const applySourceMap = require("@swissquote/crafty-commons-gulp/packages/vinyl-sourcemaps-apply.js");

function startsWithSingleDot(fpath) {
  var first2chars = fpath.slice(0, 2);
  return first2chars === `.${path.sep}` || first2chars === "./";
}

function replaceExt(npath, ext) {
  if (typeof npath !== "string") {
    return npath;
  }

  if (npath.length === 0) {
    return npath;
  }

  var nFileName = path.basename(npath, path.extname(npath)) + ext;
  var nFilepath = path.join(path.dirname(npath), nFileName);

  // Because `path.join` removes the head './' from the given path.
  // This removal can cause a problem when passing the result to `require` or
  // `import`.
  if (startsWithSingleDot(npath)) {
    return `.${path.sep}${nFilepath}`;
  }

  return nFilepath;
}

function replaceExtension(fp) {
  const extension = path.extname(fp);
  if (extension === ".mjs" || extension === ".cjs") {
    return fp;
  }

  if (extension) {
    return replaceExt(fp, ".js");
  }

  return fp;
}

const DTS_EXTENSION = /\.d\.ts$/;

module.exports = function(opts) {
  // eslint-disable-next-line no-param-reassign
  opts = opts || {};

  return new Transform({
    objectMode: true,
    transform(file, enc, cb) {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      if (file.isStream()) {
        cb(new PluginError("gulp-swc", "Streaming not supported"));
        return;
      }

      if (file.path.match(DTS_EXTENSION)) {
        cb(null, file);
        return;
      }

      const fileOpts = Object.assign({}, opts, {
        filename: file.path,
        sourceMaps: Boolean(file.sourceMap),
        caller: Object.assign({ name: "gulp-swc" }, opts.caller)
      });

      swc
        .transform(file.contents.toString(), fileOpts)
        .then(res => {
          if (res) {
            if (file.sourceMap && res.map) {
              const sourcemaps = JSON.parse(res.map);
              sourcemaps.file = replaceExtension(file.relative);
              sourcemaps.sources = sourcemaps.sources.map(filePath => {
                return file.path === filePath
                  ? replaceExtension(file.relative)
                  : replaceExtension(path.relative(file.path, filePath));
              });
              applySourceMap(file, sourcemaps);
            }

            file.contents = Buffer.from(res.code);
            file.path = replaceExtension(file.path);
          }

          this.push(file);
        })
        .catch(error => {
          // Sanitite error message for readability
          const message = error.message
            .replace(/\n+Caused by:\n(?: {4}Syntax Error$)+/gm, "")
            .replace(/^(Error: )+/i, "");

          this.emit(
            "error",
            new PluginError("gulp-swc", message, {
              fileName: file.path,
              showStack: false,
              showProperties: false
            })
          );
        })
        .then(
          () => cb(),
          () => cb()
        );
    }
  });
};
