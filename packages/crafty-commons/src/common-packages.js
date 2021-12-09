function browserslist() {
  return require("browserslist");
}

function debug() {
  return require("debug");
}

function findUp() {
  return require("find-up");
}

function glob() {
  return require("glob");
}

// TODO :: is it possible to replicate the class-style Minimatch with micromatch ?
function minimatch() {
  return require("minimatch");
}

function micromatch() {
  return require("micromatch");
}

function picomatch() {
  return require("picomatch");
}

function tmp() {
  return require("tmp");
}

module.exports = {
  browserslist,
  debug,
  findUp,
  glob,
  minimatch,
  micromatch,
  picomatch,
  tmp
};
