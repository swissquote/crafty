function babelLoader() {
  return require("babel-loader");
}

function gulpBabel() {
  return require("gulp-babel");
}

function gulpTerser() {
  return require("gulp-terser");
}

function rollupPluginBabel() {
  return require("@rollup/plugin-babel");
}

module.exports = {
  babelLoader,
  gulpBabel,
  gulpTerser,
  rollupPluginBabel
};
