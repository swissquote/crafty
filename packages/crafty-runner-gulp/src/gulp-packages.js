function endOfStream() {
  return require("end-of-stream");
}

function pump() {
  return require("pump");
}

function vinylFs() {
  return require("vinyl-fs");
}

module.exports = {
  endOfStream,
  pump,
  vinylFs
};
