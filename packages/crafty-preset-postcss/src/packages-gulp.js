function endOfStream() {
  return require("end-of-stream");
}

function gulpPostcss() {
  return require("gulp-postcss");
}

function gulpRename() {
  return require("gulp-rename");
}

function resolveFrom() {
  return require("resolve-from");
}

function streamExhaust() {
  return require("stream-exhaust");
}

function stylelint() {
  return require("stylelint");
}

function stylelintBin() {
  return require("stylelint/bin/stylelint");
}

module.exports = {
  endOfStream,
  gulpPostcss,
  gulpRename,
  resolveFrom,
  streamExhaust,
  stylelint,
  stylelintBin
};
