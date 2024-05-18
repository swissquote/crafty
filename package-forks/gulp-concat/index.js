const { Transform } = require("node:stream");
const path = require("node:path");
const File = require("vinyl");
const Concat = require("concat-with-sourcemaps");

// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function(file, opt = {}) {
  if (!file) {
    throw new Error("gulp-concat: Missing file option");
  }

  // to preserve existing |undefined| behaviour and to introduce |newLine: ""| for binaries
  if (typeof opt.newLine !== "string") {
    opt.newLine = "\n";
  }

  let isUsingSourceMaps = false;
  let latestFile;
  let latestMod;
  let fileName;
  let concat;

  if (typeof file === "string") {
    fileName = file;
  } else if (typeof file.path === "string") {
    fileName = path.basename(file.path);
  } else {
    throw new Error("gulp-concat: Missing path in file options");
  }

  function bufferContents(chunk, enc, cb) {
    // ignore empty files
    if (chunk.isNull()) {
      cb();
      return;
    }

    // we don't do streams (yet)
    if (chunk.isStream()) {
      this.emit("error", new Error("gulp-concat: Streaming not supported"));
      cb();
      return;
    }

    // enable sourcemap support for concat
    // if a sourcemap initialized file comes in
    if (chunk.sourceMap && isUsingSourceMaps === false) {
      isUsingSourceMaps = true;
    }

    // set latest file if not already set,
    // or if the current file was modified more recently.
    if (!latestMod || (chunk.stat && chunk.stat.mtime > latestMod)) {
      latestFile = chunk;
      latestMod = chunk.stat && chunk.stat.mtime;
    }

    // construct concat instance
    if (!concat) {
      concat = new Concat(isUsingSourceMaps, fileName, opt.newLine);
    }

    // add file to concat instance
    concat.add(chunk.relative, chunk.contents, chunk.sourceMap);
    cb();
  }

  function endStream(cb) {
    // no files passed in, no file goes out
    if (!latestFile || !concat) {
      cb();
      return;
    }

    let joinedFile;

    // if file opt was a file path
    // clone everything from the latest file
    if (typeof file === "string") {
      joinedFile = latestFile.clone({ contents: false });
      joinedFile.path = path.join(latestFile.base, file);
    } else {
      joinedFile = new File(file);
    }

    joinedFile.contents = concat.content;

    if (concat.sourceMapping) {
      joinedFile.sourceMap = JSON.parse(concat.sourceMap);
    }

    this.push(joinedFile);
    cb();
  }

  const transform = new Transform({
    objectMode: true,
    transform: bufferContents,
    flush: endStream
  })

  return transform;
};
