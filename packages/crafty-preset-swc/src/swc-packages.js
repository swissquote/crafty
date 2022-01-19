function swcJest() {
  return require("@swc/jest");
}

function gulpSwc() {
  return require("gulp-swc");
}

function swcLoader() {
  return require("swc-loader");
}

module.exports = {
  swcJest,
  gulpSwc,
  swcLoader
};
