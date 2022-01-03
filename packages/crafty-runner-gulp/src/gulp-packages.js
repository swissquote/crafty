function endOfStream() {
  return require("end-of-stream");
}

function gulpPlumber() {
  return require("@swissquote/gulp-plumber");
}

function pump() {
  return require("pump");
}

function vinylFs() {
  return require("vinyl-fs");
}

module.exports = {
  endOfStream,
  gulpPlumber,
  pump,
  vinylFs
};
