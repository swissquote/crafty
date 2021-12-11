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

function semver() {
  return require("semver");
}

function semverClean() {
  return require("semver/functions/clean");
}

function semverCmp() {
  return require("semver/functions/cmp");
}

function semverCoerce() {
  return require("semver/functions/coerce");
}

function semverParse() {
  return require("semver/functions/parse");
}

function semverValid() {
  return require("semver/functions/valid");
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
  semver,
  semverClean,
  semverCmp,
  semverCoerce,
  semverParse,
  semverValid,
  tmp
};
