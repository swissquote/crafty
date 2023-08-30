function babelLoader() {
  return require("babel-loader");
}

function gulpBabel() {
  return require("gulp-babel");
}

function gulpTerser() {
  return require("gulp-terser");
}

module.exports = {
  babelLoader,
  gulpBabel,
  gulpTerser
};
