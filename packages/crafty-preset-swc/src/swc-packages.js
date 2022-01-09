function swcJest() {
  return require("@swc/jest");
}

function gulpConcat() {
  return require("gulp-concat");
}

function gulpSwc() {
  return require("gulp-swc");
}

function swcLoader() {
  return require("swc-loader");
}

module.exports = {
  swcJest,
  gulpConcat,
  gulpSwc,
  swcLoader
};
